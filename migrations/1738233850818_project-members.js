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
   * CREATE TABLE project_members (
   *    user_id INT REFERENCES users(id) ON DELETE CASCADE,
   *    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
   *    assigned_at timestamptz DEFAULT NOW(),
   *    PRIMARY KEY (user_id, project_id)
   * );
   */

  pgm.createTable(
    'project_members',
    {
      user_id: {
        type: 'int',
        notNull: true,
        references: 'users',
        onDelete: 'CASCADE',
      },
      project_id: {
        type: 'int',
        notNull: true,
        references: 'projects',
        onDelete: 'CASCADE',
      },
      assigned_at: {
        type: 'timestamptz',
        default: pgm.func('NOW()'),
      },
    },
    {
      constraints: {
        primaryKey: ['user_id', 'project_id'],
      },
    },
  );
};
