describe("Create Bundling", () => {
  const url = Cypress.env("url");
  const inputer = Cypress.env("inputer");
  const approver = Cypress.env("approver");
  before(() => {
    // Menghapus semua cookies
    cy.clearCookies();

    // Menghapus semua local storage
    cy.clearLocalStorage();

    // Menghapus semua session storage
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
  });

  beforeEach(() => {
    cy.intercept(
      "POST",
      "http://localhost:3000/feasibility/addon/composite/user/preauthenticate"
    ).as("preauthenticate");

    cy.intercept(
      "POST",
      "http://localhost:3000/feasibility/addon/composite/user/authenticate"
    ).as("authenticate");
    cy.intercept("POST", "http://localhost:3000/auth/enterprise-check").as(
      "enterpriseCheck"
    );
    cy.intercept(
      "POST",
      "http://localhost:3000/feasibility/addon/composite/user/profile"
    ).as("userProfile");
    cy.intercept("POST", "http://localhost:3000/auth/asbjorn-hromundr").as(
      "asbjornHromundrAuth"
    );
    cy.intercept(
      "POST",
      "https://hasura-dev.apps.mypaas.telkom.co.id/v1/graphql"
    ).as("hasuraGraphql");
  });

  it("Create Hard Bundling", () => {
    cy.visit(url);

    cy.get("#mui-1").as("inputUsername");
    cy.get("@inputUsername").type(inputer.username, { delay: 70 });

    cy.get("#mui-2").as("inputPassword");
    cy.get("@inputPassword").type(inputer.password, { delay: 70 });

    cy.get("#mui-3").as("buttonOtp");
    cy.get("@buttonOtp").click({ force: true });

    cy.wait("@preauthenticate").its("response.statusCode").should("eq", 201);

    cy.get("#mui-4").as("inputOtp");
    cy.get("@inputOtp").type(inputer.otp, { delay: 70 });

    cy.get("#mui-5").as("inputCaptcha");
    cy.get("@inputCaptcha").type(inputer.captcha, { delay: 70 });

    cy.get("#mui-6").as("buttonSignIn");
    cy.get("@buttonSignIn").click();

    cy.wait("@authenticate").its("response.statusCode").should("eq", 201);
    cy.wait("@enterpriseCheck").its("response.statusCode").should("eq", 201);
    cy.wait("@userProfile").its("response.statusCode").should("eq", 201);
    cy.wait("@asbjornHromundrAuth")
      .its("response.statusCode")
      .should("eq", 201);
    cy.wait("@hasuraGraphql").its("response.statusCode").should("eq", 200);

    cy.get(".MuiPaper-elevation4 > .MuiToolbar-root").as("navigationBar");
    cy.get("@navigationBar").contains("Manage Product").click();

    cy.get(":nth-child(2) > .MuiMenuItem-root").as("listManageProduct");
    cy.get("@listManageProduct").click();

    cy.wait("@asbjornHromundrAuth")
      .its("response.statusCode")
      .should("eq", 201);
    cy.wait("@hasuraGraphql").its("response.statusCode").should("eq", 200);

    cy.get("#mui-28").as("inputPackageName");
    cy.get("@inputPackageName").type("Bundling Pefita Dummy | 3555", {
      delay: 70,
    });

    cy.get("#mui-29").as("inputPackageType");
    cy.get("@inputPackageType").type("Dummy", { delay: 70 });

    cy.get("#mui-30").as("inputPackageGroup");
    cy.get("@inputPackageGroup").type("Dummy", { delay: 70 });

    cy.get("#mui-31").as("inputPackageDescription");
    cy.get("@inputPackageDescription").type("Dummy", { delay: 70 });

    cy.get("#mui-32").as("inputPackageSpeed");
    cy.get("@inputPackageSpeed").type("100000", { delay: 70 });

    cy.get("#add-item-ebis").as("addItemEbis");
    cy.get("@addItemEbis").click();

    cy.get(
      ":nth-child(1) > .css-1jlvb0e-MuiStack-root > .MuiAutocomplete-root > .MuiFormControl-root > .MuiOutlinedInput-root > #asynchronous-demo"
    ).as("inputCatalogPrice");
    cy.get(
      ":nth-child(2) > .css-1jlvb0e-MuiStack-root > .MuiAutocomplete-root > .MuiFormControl-root > .MuiOutlinedInput-root > #asynchronous-demo"
    ).as("inputCatalogProduct");

    cy.get("@inputCatalogPrice").type("Telkom Price List");
    // cy.get("#asynchronous-demo-option-3").click();

    cy.get("@inputCatalogProduct").type("Telkom Products");
    // cy.get("#asynchronous-demo-option-0").click();

    cy.get(".MuiGrid-grid-xs-4 > .MuiPaper-root > .MuiBox-root").as(
      "subCatalog"
    );
    cy.get("@subCatalog").contains("Internet Services").click();

    cy.get(".MuiGrid-grid-xs-8 > .MuiPaper-root").as("listProduct");
    cy.get("@listProduct").contains("AStiWifiBasic").click();

    cy.get("#mui-34").as("buttonAddItem");
    cy.get("@buttonAddItem").click();

    // cy.get(".MuiDialogActions-root > .MuiButton-root").as("buttonSave");
    // cy.get("@buttonSave").click();

    // cy.get("#flag-bundle-select").as("selectFlagBundle");
    // cy.get(".MuiList-root").as("listFlagBundle");
  });
});
