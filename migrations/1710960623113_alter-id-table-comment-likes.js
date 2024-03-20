/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.alterColumn('dforum_test', 'comment_likes', {
    id: {
      type: 'VARCHAR(50)',
    },
  });
};

exports.down = (pgm) => {
  pgm.alterColumn('dforum_test', 'comment_likes', {
    id: {
      type: 'VARCHAR(100)',
    },
  });
};
