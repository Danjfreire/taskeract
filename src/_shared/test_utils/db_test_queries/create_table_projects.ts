export const CREATE_TABLE_USERS = `
 CREATE TABLE projects (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      start_date timestamptz NOT NULL,
      end_date timestamptz,
      status project_status DEFAULT 'planned'
    );
`;
