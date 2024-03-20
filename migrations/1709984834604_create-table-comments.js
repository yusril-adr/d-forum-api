/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users',
      onDelete: 'cascade',
    },
    thread: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'threads',
      onDelete: 'cascade',
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    isDeleted: {
      type: 'BOOLEAN',
      default: false,
    },
  });

  pgm.addConstraint('comments', 'fk_comments.owner__users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('comments', 'fk_comments.thread__threads.id', 'FOREIGN KEY(thread) REFERENCES threads(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('comments', 'fk_comments.owner__users.id');
  pgm.dropConstraint('comments', 'fk_comments.thread__threads.id');
  pgm.dropTable('comments');
};
