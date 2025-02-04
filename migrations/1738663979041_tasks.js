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
   * Equivalent to :
   *
   * CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
   *
   * CREATE TYPE task_status AS ENUM ('pending', 'in-progress', 'completed');
   *
   * CREATE TABLE tasks(
   *  id SERIAL PRIMARY KEY,
   *  title VARCHAR(100) NOT NULL,
   *  description TEXT,
   *  due_date timestamptz,
   *  project_id INT REFERENCES projects(id) ON DELETE CASCADE,
   *  priority task_priority DEFAULT 'low',
   *  status task_status DEFAULT 'pending',
   *  created_at timestamptz DEFAULT NOW(),
   * );
   */

  pgm.createType('task_priority', ['low', 'medium', 'high']);
  pgm.createType('task_status', ['pending', 'in-progress', 'completed']);

  pgm.createTable('tasks', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    title: {
      type: 'varchar(100)',
      notNull: true,
    },
    description: {
      type: 'text',
    },
    due_date: {
      type: 'timestamptz',
    },
    project_id: {
      type: 'int',
      notNull: true,
      references: 'projects',
      onDelete: 'CASCADE',
    },
    priority: {
      type: 'task_priority',
      default: 'low',
    },
    status: {
      type: 'task_status',
      default: 'pending',
    },
    created_at: {
      type: 'timestamptz',
      default: pgm.func('NOW()'),
    },
  });
};
