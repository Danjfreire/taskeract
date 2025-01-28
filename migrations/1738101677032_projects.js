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
   * CREATE TYPE project_status AS ENUM ('planned', 'ongoing', 'completed')
   *
   * CREATE TABLE projects (
   *   id SERIAL PRIMARY KEY,
   *   title VARCHAR(255) NOT NULL,
   *   description TEXT NOT NULL,
   *   start_date timestamptz NOT NULL,
   *   end_date timestamptz,
   *   status project_status DEFAULT 'planned'
   * );
   */

  pgm.createType('project_status', ['planned', 'ongoing', 'completed']);

  pgm.createTable('projects', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    title: {
      type: 'varchar(255)',
      notNull: true,
    },
    description: {
      type: 'text',
      notNull: true,
    },
    start_date: {
      type: 'timestamptz',
      notNull: true,
    },
    end_date: {
      type: 'timestamptz',
    },
    status: {
      type: 'project_status',
      notNull: true,
    },
  });
};
