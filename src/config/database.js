module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gympoint',
  define: {
    timestamps: true, // created_at e updated_at
    underscored: true, // Model=UserGroup - table=user_groups (tabela)
    underscoredAll: true, // Mesma coisa, mas para colunas e relacionamentos
  },
};
