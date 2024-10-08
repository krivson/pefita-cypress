describe("Create Bundling", () => {
  const url = Cypress.env("url");
  const inputer = Cypress.env("inputer");
  const approver = Cypress.env("approver");

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
    cy.intercept("GET", "http://localhost:3000/product/get-ebis-price-list").as(
      "getEbisPriceList"
    );
    cy.intercept("GET", "http://localhost:3000/product/get-ebis-catalog").as(
      "getEbisCatalog"
    );
    cy.intercept(
      "POST",
      "http://localhost:3000/product/get-product-default-lists"
    ).as("getProductDefaultLists");
    cy.intercept(
      "POST",
      "http://localhost:3000/product/get-ebis-list-sub-catalog"
    ).as("getEbisListSubCatalog");
    cy.intercept("POST", "http://localhost:3000/product/save-inbox").as(
      "saveInbox"
    );
    cy.intercept("POST", "http://localhost:3000/product/draft/approve").as(
      "approveDraft"
    );
    cy.intercept("POST", "http://localhost:3000/bridge/donggisig").as(
      "donggisigBridge"
    );
  });

  it("Create Hard Bundling", () => {
    cy.visit(url);

    cy.get("#mui-1").as("inputUsername");
    cy.get("@inputUsername").type(inputer.username);

    cy.get("#mui-2").as("inputPassword");
    cy.get("@inputPassword").type(inputer.password);

    function clickUntilSuccess(maxRetries = 100) {
      if (maxRetries <= 0) return;

      cy.get("#mui-3").click();
      cy.wait("@preauthenticate").its("response.statusCode").should("eq", 201);

      cy.get(".MuiPaper-root").then(($el) => {
        if (
          $el.text().includes("Get OTP Success! Please Check Your Telegram")
        ) {
          cy.log("Berhasil mendapatkan OTP");
        } else {
          cy.wait(1000);
          clickUntilSuccess(maxRetries - 1);
        }
      });
    }

    clickUntilSuccess();

    cy.get("#mui-4").as("inputOtp");
    cy.get("@inputOtp").type(inputer.otp);

    cy.get("#mui-5").as("inputCaptcha");
    cy.get("@inputCaptcha").type(inputer.captcha);

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

    cy.get("#add-item-ebis").as("addItemEbis");
    cy.get("@addItemEbis").click();

    cy.get(
      ":nth-child(1) > .css-1jlvb0e-MuiStack-root > .MuiAutocomplete-root > .MuiFormControl-root > .MuiOutlinedInput-root > #asynchronous-demo"
    ).as("inputCatalogPrice");
    cy.get(
      ":nth-child(2) > .css-1jlvb0e-MuiStack-root > .MuiAutocomplete-root > .MuiFormControl-root > .MuiOutlinedInput-root > #asynchronous-demo"
    ).as("inputCatalogProduct");

    cy.get("@inputCatalogPrice").type(inputer.catalogPrice);
    cy.wait("@getEbisPriceList")
      .its("response.statusCode")
      .then((statusCode) => {
        expect([200, 304, 201]).to.include(statusCode);
      });
    cy.get("#asynchronous-demo-option-3").click();

    cy.get("@inputCatalogProduct").type(inputer.catalogProduct);
    cy.wait("@getEbisCatalog")
      .its("response.statusCode")
      .then((statusCode) => {
        expect([200, 304, 201]).to.include(statusCode);
      });
    cy.get("#asynchronous-demo-option-0").click();

    cy.get(".MuiGrid-grid-xs-4 > .MuiPaper-root > .MuiBox-root").as(
      "subCatalog"
    );
    cy.get("@subCatalog").contains("Internet Services").click();

    cy.wait("@getEbisListSubCatalog")
      .its("response.statusCode")
      .should("eq", 201);

    cy.get(".MuiGrid-grid-xs-8 > .MuiPaper-root").as("listProduct");
    cy.get("@listProduct").contains("AStiWifiBasic").click();

    cy.get("#mui-34").as("buttonAddItem");
    cy.get("@buttonAddItem").click();

    cy.wait("@getProductDefaultLists")
      .its("response.statusCode")
      .should("eq", 201);

    cy.get(".MuiDialogActions-root").contains("Save").as("buttonSave");
    cy.get("@buttonSave").click();

    cy.get("#mui-28").as("inputPackageName");
    cy.get("@inputPackageName").type(
      `${inputer.packageName} | ${Math.floor(Math.random() * 9000) + 1000}`
    );

    cy.get("#mui-29").as("inputPackageType");
    cy.get("@inputPackageType").type(inputer.packageType);

    cy.get("#mui-30").as("inputPackageGroup");
    cy.get("@inputPackageGroup").type(inputer.packageGroup);

    cy.get("#mui-31").as("inputPackageDescription");
    cy.get("@inputPackageDescription").type(inputer.packageDescription);

    cy.get("#mui-32").as("inputPackageSpeed");
    cy.get("@inputPackageSpeed").type(inputer.packageSpeed);

    // Upload file manual bagian file Package NDE dengan waktu 30 detik.
    cy.wait(30000);

    cy.get("#flag-bundle-select").as("selectFlagBundle");
    cy.get("@selectFlagBundle").click();
    cy.get(".MuiList-root").as("listFlagBundle");
    cy.get("@listFlagBundle").contains("Hard Bundling").click();

    cy.get(
      "form > .css-1hecsjb-MuiStack-root > .css-m69qwo-MuiStack-root > .css-11bptb8-MuiStack-root > #btn-save-product"
    ).click();

    cy.wait("@saveInbox").its("response.statusCode").should("eq", 201);
  });

  it("Create Soft Bundling", () => {
    cy.visit(url);

    cy.get("#mui-1").as("inputUsername");
    cy.get("@inputUsername").type(inputer.username);

    cy.get("#mui-2").as("inputPassword");
    cy.get("@inputPassword").type(inputer.password);

    function clickUntilSuccess(maxRetries = 100) {
      if (maxRetries <= 0) return;

      cy.get("#mui-3").click();
      cy.wait("@preauthenticate").its("response.statusCode").should("eq", 201);

      cy.get(".MuiPaper-root").then(($el) => {
        if (
          $el.text().includes("Get OTP Success! Please Check Your Telegram")
        ) {
          cy.log("Berhasil mendapatkan OTP");
        } else {
          cy.wait(1000);
          clickUntilSuccess(maxRetries - 1);
        }
      });
    }

    clickUntilSuccess();

    cy.get("#mui-4").as("inputOtp");
    cy.get("@inputOtp").type(inputer.otp);

    cy.get("#mui-5").as("inputCaptcha");
    cy.get("@inputCaptcha").type(inputer.captcha);

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

    cy.get("#add-item-ebis").as("addItemEbis");
    cy.get("@addItemEbis").click();

    cy.get(
      ":nth-child(1) > .css-1jlvb0e-MuiStack-root > .MuiAutocomplete-root > .MuiFormControl-root > .MuiOutlinedInput-root > #asynchronous-demo"
    ).as("inputCatalogPrice");
    cy.get(
      ":nth-child(2) > .css-1jlvb0e-MuiStack-root > .MuiAutocomplete-root > .MuiFormControl-root > .MuiOutlinedInput-root > #asynchronous-demo"
    ).as("inputCatalogProduct");

    cy.get("@inputCatalogPrice").type(inputer.catalogPrice);
    cy.wait("@getEbisPriceList")
      .its("response.statusCode")
      .then((statusCode) => {
        expect([200, 304, 201]).to.include(statusCode);
      });
    cy.get("#asynchronous-demo-option-3").click();

    cy.get("@inputCatalogProduct").type(inputer.catalogProduct);
    cy.wait("@getEbisCatalog")
      .its("response.statusCode")
      .then((statusCode) => {
        expect([200, 304, 201]).to.include(statusCode);
      });
    cy.get("#asynchronous-demo-option-0").click();

    cy.get(".MuiGrid-grid-xs-4 > .MuiPaper-root > .MuiBox-root").as(
      "subCatalog"
    );
    cy.get("@subCatalog").contains("Internet Services").click();

    cy.wait("@getEbisListSubCatalog")
      .its("response.statusCode")
      .should("eq", 201);

    cy.get(".MuiGrid-grid-xs-8 > .MuiPaper-root").as("listProduct");
    cy.get("@listProduct").contains("AStiWifiBasic").click();

    cy.get("#mui-34").as("buttonAddItem");
    cy.get("@buttonAddItem").click();

    cy.wait("@getProductDefaultLists")
      .its("response.statusCode")
      .should("eq", 201);

    cy.get(".MuiDialogActions-root").contains("Save").as("buttonSave");
    cy.get("@buttonSave").click();

    cy.get("#mui-28").as("inputPackageName");
    cy.get("@inputPackageName").type(
      `${inputer.packageName} | ${Math.floor(Math.random() * 9000) + 1000}`
    );

    cy.get("#mui-29").as("inputPackageType");
    cy.get("@inputPackageType").type(inputer.packageType);

    cy.get("#mui-30").as("inputPackageGroup");
    cy.get("@inputPackageGroup").type(inputer.packageGroup);

    cy.get("#mui-31").as("inputPackageDescription");
    cy.get("@inputPackageDescription").type(inputer.packageDescription);

    cy.get("#mui-32").as("inputPackageSpeed");
    cy.get("@inputPackageSpeed").type(inputer.packageSpeed);

    // Upload file manual bagian file Package NDE dengan waktu 30 detik.
    cy.wait(30000);

    cy.get("#flag-bundle-select").as("selectFlagBundle");
    cy.get("@selectFlagBundle").click();
    cy.get(".MuiList-root").as("listFlagBundle");
    cy.get("@listFlagBundle").contains("Soft Bundling").click();

    cy.get(
      "form > .css-1hecsjb-MuiStack-root > .css-m69qwo-MuiStack-root > .css-11bptb8-MuiStack-root > #btn-save-product"
    ).click();

    cy.wait("@saveInbox").its("response.statusCode").should("eq", 201);
  });

  it("Check Status Product Bundling", () => {
    cy.visit(url);

    cy.get("#mui-1").as("inputUsername");
    cy.get("@inputUsername").type(approver.username);

    cy.get("#mui-2").as("inputPassword");
    cy.get("@inputPassword").type(approver.password);

    function clickUntilSuccess(maxRetries = 100) {
      if (maxRetries <= 0) return;

      cy.get("#mui-3").click();
      cy.wait("@preauthenticate").its("response.statusCode").should("eq", 201);

      cy.get(".MuiPaper-root").then(($el) => {
        if (
          $el.text().includes("Get OTP Success! Please Check Your Telegram")
        ) {
          cy.log("Berhasil mendapatkan OTP");
        } else {
          cy.wait(1000);
          clickUntilSuccess(maxRetries - 1);
        }
      });
    }

    clickUntilSuccess();

    cy.get("#mui-4").as("inputOtp");
    cy.get("@inputOtp").type(approver.otp);

    cy.get("#mui-5").as("inputCaptcha");
    cy.get("@inputCaptcha").type(approver.captcha);

    cy.get("#mui-6").as("buttonSignIn");
    cy.get("@buttonSignIn").click();

    cy.wait("@authenticate").its("response.statusCode").should("eq", 201);
    cy.wait("@enterpriseCheck").its("response.statusCode").should("eq", 201);
    cy.wait("@userProfile").its("response.statusCode").should("eq", 201);
    cy.wait("@asbjornHromundrAuth")
      .its("response.statusCode")
      .should("eq", 201);
    cy.wait("@hasuraGraphql").its("response.statusCode").should("eq", 200);

    cy.get(".MuiPaper-elevation4 > .MuiToolbar-root").as("Navbar");
    cy.get("@Navbar").contains("Inbox").click();
    cy.get(".MuiPaper-root > .MuiList-root").contains("Product").click();
    cy.wait("@asbjornHromundrAuth")
      .its("response.statusCode")
      .should("eq", 201);
    cy.wait("@hasuraGraphql").its("response.statusCode").should("eq", 200);
    cy.wait("@hasuraGraphql").its("response.statusCode").should("eq", 200);

    // cy.get(
    //   ":nth-child(1) > :nth-child(7) > .css-1dwseqc > .MuiBox-root > path"
    // ).click();
    // cy.wait("@asbjornHromundrAuth")
    //   .its("response.statusCode")
    //   .should("eq", 201);
    // cy.wait("@hasuraGraphql").its("response.statusCode").should("eq", 200);
    // cy.get("#simple-tabpanel-2 > :nth-child(1) > :nth-child(1)")
    //   .contains("Approve")
    //   .click();
    // cy.get(".MuiDialogActions-root").contains("Save").click();
    // cy.wait("@approveDraft").its("response.statusCode").should("eq", 201);
    // cy.wait("@donggisigBridge").its("response.statusCode").should("eq", 201);
  });
});
