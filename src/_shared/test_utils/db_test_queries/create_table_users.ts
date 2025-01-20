export const CREATE_TABLE_USERS = `
CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'worker',
        is_active BOOLEAN NOT NULL DEFAULT TRUE 
      );
`;
