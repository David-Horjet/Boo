const chai = require('chai'); 
const app = require('../app');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const Profile = require('../models/Profile');
const Comment = require('../models/Comment');

const expect = chai.expect;

describe('Comment API', () => {
    let con
    let mongoServer

    before(async () => {
        mongoServer = await MongoMemoryServer.create();
        con = await MongoClient.connect(mongoServer.getUri(), {});
    });

    after(async () => {
        if (con) {
            await con.close();
        }
        if (mongoServer) {
            await mongoServer.stop();
        }
    });

    // Test creating a comment
    it('should create a new comment', (done) => {
        const newProfile = new Profile({ name: 'Test User' });
        newProfile.save(async (err, profile) => {
            chai.request(app)
                .post('/comments')
                .send({ text: 'This is a test comment', userId: profile._id })
                .end(async (err, res) => {
                    expect(res).to.have.status(201);
                    const comments = await Comment.find();
                    expect(comments).to.have.lengthOf(1);
                    done();
                });
        });
    });

    // Test liking a comment
    it('should like a comment', (done) => {
        const newProfile = new Profile({ name: 'Test User' });
        newProfile.save(async (err, user) => {
            const newComment = new Comment({ text: 'Test Comment', user });
            newComment.save(async (err, comment) => {
                chai.request(app)
                    .post(`/comments/${comment._id}/like`)
                    .send({ userId: user._id })
                    .end(async (err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body.likes).to.include(user._id.toString());
                        done();
                    });
            });
        });
    });
});
