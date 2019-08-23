describe('Class relations screen validation', () => {

    let repositoryId;

    before(() => {
        repositoryId = 'class-relations-repo' + Date.now();
        cy.createRepository({id: repositoryId});
        cy.importFromUrl(repositoryId, 'https://www.w3.org/TR/owl-guide/wine.rdf', {});
    });

    beforeEach(() => {
        cy.presetRepositoryCookie(repositoryId);

        cy.visit('/relationships');
        // The diagram and the list should be visible in order to assume the page is ready
        cy.get('#dependencies-chord').should('be.visible');
        cy.get('#wb-dependencies-classInClasses').should('be.visible');
    });

    after(() => {
        cy.deleteRepository(repositoryId);
    });

    function getFilterField() {
        return cy.get('.search-filter-field');
    }

    function filterByClass(name) {
        getFilterField().type(name);
    }

    function getDirectionFilter() {
        return cy.get('.direction-filter');
    }

    function verifySelectedDirectionFilter(name) {
        getDirectionFilter().find('input[type=radio]:checked').should('have.value', name);
    }

    function getRelationsToolbar() {
        return cy.get('.relations-toolbar');
    }

    function getDependenciesList() {
        return cy.get('#wb-dependencies-classInClasses');
    }

    function verifyListLength(count) {
        getDependenciesList().find('.item .row').should('have.length', count);
    }

    it('Test initial state', function () {
        // Filter field should be visible
        getFilterField().should('be.visible');
        // Dependencies label should be present and showing proper text
        cy.get('.available-dependencies-label')
            .should('be.visible')
            .contains('Showing the dependencies between 10 classes');
        // Directions filter buttons should be visible
        getDirectionFilter().should('be.visible');
        // And the "All" radio button must be selected by default
        verifySelectedDirectionFilter('all');
        // The toolbar and its buttons should be visible
        getRelationsToolbar().should('be.visible').within(() => {
            cy.get('.remove-all-classes-btn').should('be.visible');
            cy.get('.reload-diagram-btn').should('be.visible');
            cy.get('.export-diagram-btn').should('be.visible');
        });
        // Class relations list should be visible and have 10 classes selected
        getDependenciesList().should('be.visible').within(() => {
            cy.get('.item .row.active').should('have.length', 10);
        });
        // Diagram should be visible and showing 10 classes
        cy.get('#dependencies-chord').should('be.visible').within(() => {
            cy.get('.group').should('have.length', 10);
        });
    });

    it('Search for a class', function () {
        // Expect 10 rows initially to be visible
        verifyListLength(10);
        // Filter by partial name
        filterByClass(':Wine');
        // Expecting 6 rows to be present
        verifyListLength(6);
        // Clear the filter and expect all rows to be visible again
        getFilterField().clear();
        verifyListLength(10);
    });
});