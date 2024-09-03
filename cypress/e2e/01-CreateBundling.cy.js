describe("Create Bundling", () => {
  const url = Cypress.env("url");
  const users = Cypress.env("users");

  before(() => {
    cy.intercept(
      "POST",
      "/feasibility/addon/composite/user/preauthenticate"
    ).as("preAuthenticate");
    cy.intercept("POST", "/feasibility/addon/composite/user/authenticate").as(
      "authenticate"
    );
    cy.intercept("POST", "/auth/enterprise-check").as("enterpriseCheck");
    cy.intercept("POST", "/feasibility/addon/composite/user/profile").as(
      "getUserProfile"
    );
    cy.intercept("POST", "/auth/asbjorn-hromundr").as("asbjornHromundr");
    cy.intercept(
      "POST",
      "https://hasura-dev.apps.mypaas.telkom.co.id/v1/graphql"
    ).as("graphqlQuery");
    cy.intercept("GET", "/product/get-ebis-price-list").as("getEbisPriceList");
  });

  it("Create Hard Bundling", () => {
    cy.visit(url);

    cy.get("#mui-1").type(users[0].username);
    cy.get("#mui-2").type(users[0].password);
    cy.get("#mui-3").click();
    cy.wait("@preAuthenticate").then((intercept) => {
      expect(intercept.response.statusCode).to.eq(201);
    });
    cy.get("#mui-4").type(users[0].otp);
    cy.get("#mui-5").type(users[0].captcha);
    cy.get("#mui-6").click();
    cy.wait("@enterpriseCheck").then((intercept) => {
      expect(intercept.response.statusCode).to.eq(201);
    });
    cy.wait("@getUserProfile").then((intercept) => {
      expect(intercept.response.statusCode).to.eq(201);
    });
    cy.wait("@asbjornHromundr").then((intercept) => {
      expect(intercept.response.statusCode).to.eq(201);
    });
    cy.wait("@getUserProfile").then((intercept) => {
      expect(intercept.response.statusCode).to.eq(201);
    });
    cy.wait("@graphqlQuery").then((intercept) => {
      expect(intercept.response.statusCode).to.eq(200);
    });

    // ---

    cy.get(".MuiPaper-elevation4 > .MuiToolbar-root")
      .contains("Manage Product")
      .click();
    cy.get(".MuiPaper-root > .MuiList-root").contains("Create Product").click();
    cy.wait("@asbjornHromundr").then((intercept) => {
      expect(intercept.response.statusCode).to.eq(201);
    });
    cy.wait("@graphqlQuery").then((intercept) => {
      expect(intercept.response.statusCode).to.eq(200);
    });
    cy.get("#add-item-ebis").click();
    cy.get(
      ":nth-child(1) > .css-1jlvb0e-MuiStack-root > .MuiAutocomplete-root > .MuiFormControl-root > .MuiOutlinedInput-root > #asynchronous-demo"
    ).type("Telkom Price List");
    cy.wait("@getEbisPriceList").then((intercept) => {
      expect(intercept.response.statusCode).to.eq(200);
    });
    cy.get("#asynchronous-demo-option-3").click();
  });
});
