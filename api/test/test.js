import chai from "chai";
import chatHttp from "chai-http";
import "chai/register-should";
import app from "../index";

chai.use(chatHttp);
const { expect } = chai;

describe("Testing the file endpoints:", () => {
  it("It should get no Files", (done) => {
    chai
      .request(app)
      .get("/api/v1/files")
      .set("Accept", "application/json")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        res.body.should.have.property("message").eql("No File found.");
        done();
      });
  });

  it("It should create a File with valid CSV url", (done) => {
    const data = {
      url: "rhacarys.github.io/pontos.csv",
    };
    chai
      .request(app)
      .post("/api/v1/files")
      .set("Accept", "application/json")
      .send(data)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.data).to.include({
          id: 1,
          filename: data.url,
        });
        res.body.data.should.have.property("points");
        expect(res.body.data.points).to.be.an("array");
        expect(res.body.data.points).to.have.length(4);
        done();
      });
  });

  it("It should not create a File without url parameter", (done) => {
    const data = {};
    chai
      .request(app)
      .post("/api/v1/files")
      .set("Accept", "application/json")
      .send(data)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it("It should not create a File with empty url", (done) => {
    const data = {
      url: "",
    };
    chai
      .request(app)
      .post("/api/v1/files")
      .set("Accept", "application/json")
      .send(data)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it("It should not create a File with unreachable url", (done) => {
    const data = {
      url: "any.fake.url",
    };
    chai
      .request(app)
      .post("/api/v1/files")
      .set("Accept", "application/json")
      .send(data)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it("It should not create a File with invalid url", (done) => {
    const data = {
      url: "rhacarys.github.io/undefined",
    };
    chai
      .request(app)
      .post("/api/v1/files")
      .set("Accept", "application/json")
      .send(data)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it("It should not create a File with non-parsable file", (done) => {
    const data = {
      url: "rhacarys.github.io/README.md",
    };
    chai
      .request(app)
      .post("/api/v1/files")
      .set("Accept", "application/json")
      .send(data)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it("It should get all Files", (done) => {
    chai
      .request(app)
      .get("/api/v1/files")
      .set("Accept", "application/json")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data).to.be.an("array");
        expect(res.body.data).to.have.length(1);
        res.body.data[0].should.have.property("id");
        res.body.data[0].should.have.property("filename");
        res.body.data[0].should.not.have.property("points");
        done();
      });
  });

  it("It should get a particular File", (done) => {
    const fileId = 1;
    chai
      .request(app)
      .get(`/api/v1/files/${fileId}`)
      .set("Accept", "application/json")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        res.body.data.should.have.property("id");
        res.body.data.should.have.property("filename");
        res.body.data.should.have.property("points");
        expect(res.body.data.points).to.be.an("array");
        expect(res.body.data.points).to.have.length(4);
        done();
      });
  });

  it("It should not get a particular File with invalid id", (done) => {
    const fileId = 8888;
    chai
      .request(app)
      .get(`/api/v1/files/${fileId}`)
      .set("Accept", "application/json")
      .end((err, res) => {
        expect(res.status).to.equal(404);
        res.body.should.have
          .property("message")
          .eql(`Cannot find File with the id ${fileId}.`);
        done();
      });
  });

  it("It should not get a particular File with non-numeric id", (done) => {
    const fileId = "aaa";
    chai
      .request(app)
      .get(`/api/v1/files/${fileId}`)
      .set("Accept", "application/json")
      .end((err, res) => {
        expect(res.status).to.equal(400);
        res.body.should.have
          .property("message")
          .eql("Please input a valid numeric value.");
        done();
      });
  });

  it("It should delete a File", (done) => {
    const fileId = 1;
    chai
      .request(app)
      .delete(`/api/v1/files/${fileId}`)
      .set("Accept", "application/json")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data).to.include({});
        done();
      });
  });

  it("It should not delete a File with invalid id", (done) => {
    const fileId = 777;
    chai
      .request(app)
      .delete(`/api/v1/files/${fileId}`)
      .set("Accept", "application/json")
      .end((err, res) => {
        expect(res.status).to.equal(404);
        res.body.should.have
          .property("message")
          .eql(`File with the id ${fileId} cannot be found.`);
        done();
      });
  });

  it("It should not delete a File with non-numeric id", (done) => {
    const fileId = "bbb";
    chai
      .request(app)
      .delete(`/api/v1/files/${fileId}`)
      .set("Accept", "application/json")
      .end((err, res) => {
        expect(res.status).to.equal(400);
        res.body.should.have
          .property("message")
          .eql("Please provide a numeric value.");
        done();
      });
  });
});
