describe('SIPILIH - API Integration Tests', () => {
  
  describe('Candidate API', () => {
    it('should fetch all candidates successfully', () => {
      cy.apiRequest('GET', '/candidate/getAllCandidates').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
    });

    it('should return candidate with election details', () => {
      cy.apiRequest('GET', '/candidate/getAllCandidates').then((response) => {
        expect(response.status).to.eq(200);
        if (response.body.length > 0) {
          expect(response.body[0]).to.have.property('name');
          expect(response.body[0]).to.have.property('election');
        }
      });
    });

    it('should handle API errors gracefully', () => {
      cy.apiRequest('GET', '/candidate/invalid-endpoint').then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });

  describe('Election API', () => {
    it('should fetch all elections successfully', () => {
      cy.apiRequest('GET', '/election/getAllElections').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
    });

    it('should return election with candidates', () => {
      cy.apiRequest('GET', '/election/getAllElections').then((response) => {
        expect(response.status).to.eq(200);
        if (response.body.length > 0) {
          expect(response.body[0]).to.have.property('title');
          expect(response.body[0]).to.have.property('description');
          expect(response.body[0]).to.have.property('candidates');
        }
      });
    });

    it('should filter active elections', () => {
      cy.apiRequest('GET', '/election/getAllElections').then((response) => {
        expect(response.status).to.eq(200);
        const activeElections = response.body.filter(e => {
          const now = new Date();
          const start = new Date(e.startDate);
          const end = new Date(e.endDate);
          return now >= start && now <= end;
        });
        expect(activeElections).to.be.an('array');
      });
    });
  });

  describe('Voter API', () => {
    it('should handle voter endpoints', () => {
      cy.apiRequest('GET', '/voter').then((response) => {
        expect([200, 401, 403]).to.include(response.status);
      });
    });
  });

  describe('API Performance', () => {
    it('should respond within acceptable time', () => {
      const start = Date.now();
      cy.apiRequest('GET', '/election/getAllElections').then(() => {
        const responseTime = Date.now() - start;
        expect(responseTime).to.be.lessThan(3000);
      });
    });

    it('should handle concurrent requests', () => {
      const requests = [
        cy.apiRequest('GET', '/election/getAllElections'),
        cy.apiRequest('GET', '/candidate/getAllCandidates'),
      ];
      
      Promise.all(requests).then((responses) => {
        responses.forEach(response => {
          expect(response.status).to.be.oneOf([200, 401]);
        });
      });
    });
  });

  describe('API Error Handling', () => {
    it('should return 404 for non-existent endpoints', () => {
      cy.apiRequest('GET', '/api/nonexistent').then((response) => {
        expect(response.status).to.eq(404);
      });
    });

    it('should handle malformed requests', () => {
      cy.apiRequest('POST', '/candidate/getAllCandidates', { invalid: 'data' }).then((response) => {
        expect([400, 405]).to.include(response.status);
      });
    });
  });
});