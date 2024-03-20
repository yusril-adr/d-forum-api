/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('replies', {
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
    parent: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'comments',
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

  pgm.addConstraint('replies', 'fk_replies.owner__users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('replies', 'fk_replies.parent__comments.id', 'FOREIGN KEY(parent) REFERENCES comments(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('replies', 'fk_replies.owner__users.id');
  pgm.dropConstraint('replies', 'fk_replies.parent__comments.id');
  pgm.dropTable('replies');
};
