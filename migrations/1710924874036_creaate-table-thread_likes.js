/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('thread_likes', {
    id: {
      type: 'VARCHAR(100)',
      primaryKey: true,
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
  });

  pgm.addConstraint('thread_likes', 'fk_thread_likes.owner__users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('thread_likes', 'fk_thread_likes.thread_threads.id', 'FOREIGN KEY(thread) REFERENCES threads(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('thread_likes', 'fk_thread_likes.owner__users.id');
  pgm.dropConstraint('thread_likes', 'fk_thread_likes.thread_threads.id');
  pgm.dropTable('thread_likes');
};
