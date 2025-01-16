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
   * ALTER TABLE users ADD COLUMN role VARCHAR(255) NOT NULL DEFAULT 'worker';
   */

  pgm.addColumn('users', {
    role: {
      type: 'varchar(255)',
      notNull: true,
      default: 'worker,',
    },
  });
};
