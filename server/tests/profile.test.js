const chai = require('chai');
const app = require('../app');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const Profile = require('../models/Profile');
const Comment = require('../models/Comment');

const expect = chai.expect;

describe('Profile Api', () => {
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
    // Test the creation of a profile
    it('should create a new profile', (done) => {
        chai.request(app)
            .post('/profiles')
            .send({ name: 'John Doe', email: 'johndoe@example.com' })
            .end(async (err, res) => {
                expect(res).to.have.status(302); // Check for a successful redirect
                const profiles = await Profile.find();
                expect(profiles).to.have.lengthOf(1); // Ensure a profile was added
                done();
            });
    });

    // Test getting a profile by ID
    it('should get a profile by ID', (done) => {
        const newProfile = new Profile({ name: 'Test User', email: 'test@example.com' });
        newProfile.save((err, profile) => {
            chai.request(app)
                .get(`/profiles/${profile._id}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.contain('Test User');
                    expect(res.text).to.contain('test@example.com');
                    done();
                });
        });
    });
});
