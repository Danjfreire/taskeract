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
     * CREATE TABLE users (
     *  id SERIAL PRIMARY KEY,
     *  name VARCHAR(255) NOT NULL,
     *  email VARCHAR(255) NOT NULL UNIQUE,
     *  password VARCHAR(255) NOT NULL
     * );
     */

    pgm.createTable('users', {
        id: {
            type: 'serial',
            primaryKey: true,
        },
        name: {
            type: 'varchar(255)',
            notNull: true,
        },
        email: {
            type: 'varchar(255)',
            notNull: true,
            unique: true,
        },
        password: {
            type: 'varchar(255)',
            notNull: true,
        }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {};
