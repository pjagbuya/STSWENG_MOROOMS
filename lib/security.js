import bcrypt from 'bcryptjs';

export class SecurityService {
  /**
   * Hash a security answer (case-insensitive, trimmed)
   * @param {string} answer
   * @returns {Promise<string>}
   */
  static async hashSecurityAnswer(answer) {
    if (!answer || typeof answer !== 'string') {
      throw new Error('Invalid answer provided');
    }

    // Normalize: trim, lowercase for consistency
    const normalizedAnswer = answer.trim().toLowerCase();

    if (normalizedAnswer.length < 2) {
      throw new Error('Answer must be at least 2 characters long');
    }

    const saltRounds = 12;
    return await bcrypt.hash(normalizedAnswer, saltRounds);
  }

  /**
   * Verify a security answer against hash
   * @param {string} answer
   * @param {string} hash
   * @returns {Promise<boolean>}
   */
  static async verifySecurityAnswer(answer, hash) {
    if (!answer || !hash) return false;

    // Normalize the same way as when hashing
    const normalizedAnswer = answer.trim().toLowerCase();
    return await bcrypt.compare(normalizedAnswer, hash);
  }

  /**
   * Get all security questions
   * @returns {Promise<Array>}
   */
  // Update the getSecurityQuestions method in lib/security.js
  static async getSecurityQuestions() {
    const { createClient } = await import('@/utils/supabase/server');
    const supabase = createClient();

    console.log('Retrieving security questions from database...');

    try {
      const { data, error } = await supabase
        .from('security_questions')
        .select('*')
        .order('id');

      console.log('Query result - data:', data);
      console.log('Query result - error:', error);

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Returning data:', data);
      return data || [];
    } catch (err) {
      console.error('Exception in getSecurityQuestions:', err);
      throw err;
    }
  }

  /**
   * Save user security answers
   * @param {string} userId
   * @param {Array<{questionId: number, answer: string}>} answers
   */
  static async saveSecurityAnswers(userId, answers) {
    const { createClient } = await import('@/utils/supabase/server');
    const supabase = createClient(true); // Use service role for secure operations

    if (!answers || answers.length < 2) {
      throw new Error('Both security questions must be answered');
    }

    // Hash all answers
    const hashedAnswers = await Promise.all(
      answers.map(async ({ questionId, answer }) => ({
        user_id: userId,
        question_id: questionId,
        answer_hash: await this.hashSecurityAnswer(answer),
      })),
    );

    // Upsert the answers
    const { error } = await supabase
      .from('user_security_answers')
      .upsert(hashedAnswers, { onConflict: 'user_id,question_id' });

    if (error) throw error;
  }

  /**
   * Verify user security answers
   * @param {string} userId
   * @param {Array<{questionId: number, answer: string}>} answers
   * @returns {Promise<boolean>}
   */
  static async verifySecurityAnswers(userId, answers) {
    const { createClient } = await import('@/utils/supabase/server');
    const supabase = createClient(true);

    if (!answers || answers.length < 2) {
      return false;
    }

    // Get stored hashes for the user
    const { data: storedAnswers, error } = await supabase
      .from('user_security_answers')
      .select('question_id, answer_hash')
      .eq('user_id', userId);

    if (error || !storedAnswers || storedAnswers.length < 2) {
      console.log('No answers returned');
      return false;
    }

    // Verify each answer
    let i = 0;
    for (const { questionId, answer } of answers) {
      const stored = storedAnswers.find(sa => sa.question_id === questionId);

      if (!stored) return false;

      i++;
      const isValid = await this.verifySecurityAnswer(
        answer,
        stored.answer_hash,
      );
      if (!isValid) return false;
    }

    return true;
  }
}
