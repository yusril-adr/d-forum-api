/* istanbul ignore file */

const { createContainer } = require('instances-container');

// external agency
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const joi = require('joi');
const pool = require('./database/postgres/pool');

// service (repository, helper, manager, etc)
const Validator = require('./validator/Validator');

const UserRepository = require('../Domains/users/UserRepository');
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');

const AuthenticationRepository = require('../Domains/authentications/AuthenticationRepository');
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');

const AuthenticationTokenManager = require('../Applications/security/AuthenticationTokenManager');
const PasswordHash = require('../Applications/security/PasswordHash');
const JwtTokenManager = require('./security/JwtTokenManager');
const BcryptPasswordHash = require('./security/BcryptPasswordHash');

const ThreadRepository = require('../Domains/threads/ThreadRepository');
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres');

const CommentRepository = require('../Domains/comments/CommentRepository');
const CommentRepositoryPostgres = require('./repository/CommentRepositoryPostgres');
const Comment = require('../Domains/comments/entities/Comment');

const ReplyRepository = require('../Domains/replies/ReplyRepository');
const ReplyRepositoryPostgres = require('./repository/ReplyRepositoryPostgres');
const Reply = require('../Domains/replies/entities/Reply');

const LikeRepository = require('../Domains/likes/LikeRepository');
const LikeRepositoryPostgres = require('./repository/LikeRepositoryPostgres');

// use case
const AddUserUseCase = require('../Applications/use_case/users/AddUserUseCase');

const LoginUserUseCase = require('../Applications/use_case/authentications/LoginUserUseCase');
const LogoutUserUseCase = require('../Applications/use_case/authentications/LogoutUserUseCase');
const RefreshAuthenticationUseCase = require('../Applications/use_case/authentications/RefreshAuthenticationUseCase');

const AddThreadUseCase = require('../Applications/use_case/threads/AddThreadUseCase');
const GetThreadsUseCase = require('../Applications/use_case/threads/GetThreadsUseCase');
const GetThreadByIdUseCase = require('../Applications/use_case/threads/GetThreadByIdUseCase');
const DeleteThreadByIdUseCase = require('../Applications/use_case/threads/DeleteThreadByIdUseCase');

const AddCommentUseCase = require('../Applications/use_case/comments/AddCommentUseCase');
const DeleteCommentByIdUseCase = require('../Applications/use_case/comments/DeleteCommentByIdUseCase');

const AddReplyUseCase = require('../Applications/use_case/replies/AddReplyUseCase');
const DeleteReplyByIdUseCase = require('../Applications/use_case/replies/DeleteReplyByIdUseCase');

const LikeThreadUseCase = require('../Applications/use_case/likes/LikeThreadUseCase');
const LikeCommentUseCase = require('../Applications/use_case/likes/LikeCommentUseCase');

// creating container
const container = createContainer();

// registering services and repository
container.register([
  {
    key: Validator.name,
    Class: Validator,
    parameter: {
      dependencies: [
        {
          concrete: joi,
        },
      ],
    },
  },
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ],
    },
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token,
        },
      ],
    },
  },
  {
    key: ThreadRepository.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: CommentRepository.name,
    Class: CommentRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: ReplyRepository.name,
    Class: ReplyRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: LikeRepository.name,
    Class: LikeRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
]);

// registering use cases
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
      ],
    },
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
        {
          name: 'validator',
          internal: Validator.name,
        },
      ],
    },
  },
  {
    key: GetThreadsUseCase.name,
    Class: GetThreadsUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
      ],
    },
  },
  {
    key: GetThreadByIdUseCase.name,
    Class: GetThreadByIdUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name,
        },
        {
          name: 'replyRepository',
          internal: ReplyRepository.name,
        },
        {
          name: 'likeRepository',
          internal: LikeRepository.name,
        },
        {
          name: 'Comment',
          concrete: Comment,
        },
        {
          name: 'Reply',
          concrete: Reply,
        },
      ],
    },
  },
  {
    key: DeleteThreadByIdUseCase.name,
    Class: DeleteThreadByIdUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
      ],
    },
  },
  {
    key: AddCommentUseCase.name,
    Class: AddCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name,
        },
        {
          name: 'validator',
          internal: Validator.name,
        },
      ],
    },
  },
  {
    key: DeleteCommentByIdUseCase.name,
    Class: DeleteCommentByIdUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name,
        },
      ],
    },
  },
  {
    key: AddReplyUseCase.name,
    Class: AddReplyUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name,
        },
        {
          name: 'replyRepository',
          internal: ReplyRepository.name,
        },
        {
          name: 'validator',
          internal: Validator.name,
        },
      ],
    },
  },
  {
    key: DeleteReplyByIdUseCase.name,
    Class: DeleteReplyByIdUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name,
        },
        {
          name: 'replyRepository',
          internal: ReplyRepository.name,
        },
      ],
    },
  },
  {
    key: LikeThreadUseCase.name,
    Class: LikeThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
        {
          name: 'likeRepository',
          internal: LikeRepository.name,
        },
      ],
    },
  },
  // {
  //   key: LikeCommentUseCase.name,
  //   Class: LikeCommentUseCase,
  //   parameter: {
  //     injectType: 'destructuring',
  //     dependencies: [
  //       {
  //         name: 'threadRepository',
  //         internal: ThreadRepository.name,
  //       },
  //       {
  //         name: 'commentRepository',
  //         internal: CommentRepository.name,
  //       },
  //       {
  //         name: 'likeRepository',
  //         internal: LikeRepository.name,
  //       },
  //     ],
  //   },
  // },
]);

module.exports = container;
