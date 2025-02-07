/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  /**
   * Equivalent to:
   *
   * CREATE TABLE task_assignee (
   *    user_id INT REFERENCES users(id) ON DELETE CASCADE,
   *    task_id INT REFERENCES tasks(id) ON DELETE CASCADE,
   *    assigned_at timestamptz DEFAULT NOW(),
   *    PRIMARY KEY (user_id, task_id)
   * );
   */

  pgm.createTable(
    'task_assignee',
    {
      user_id: {
        type: 'int',
        notNull: true,
        references: 'users',
        onDelete: 'CASCADE',
      },
      task_id: {
        type: 'int',
        notNull: true,
        references: 'tasks',
        onDelete: 'CASCADE',
      },
      assigned_at: {
        type: 'timestamptz',
        default: pgm.func('NOW()'),
      },
    },
    {
      constraints: {
        primaryKey: ['user_id', 'task_id'],
      },
    },
  );
};
