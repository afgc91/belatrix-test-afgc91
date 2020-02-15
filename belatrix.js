describe('Belatrix Exam', function () {
    const BASE_URL = 'https://www.ebay.com/'
    const WAI_TIME_MILLISECONDS = 1000
    const INPUT_SEARCH_SELECTOR = '#gh-ac'
    const SEARCH_STRING = 'shoes'
    const SEARCH_BUTTON_SELECTOR = '#gh-btn'
    const PUMA_BRAND_CHECKBOX_SELECTOR = '[data-idx="6"] > .x-refine__multi-select > .x-refine__multi-select-link > .x-refine__select__svg > .x-refine__multi-select-checkbox'
    const SHOES_SIZE10_CHECKBOX_SELECTOR = '#x-refine__group_1__0 > .x-refine__main__value > :nth-child(5) > .x-refine__multi-select > .x-refine__multi-select-link > .x-refine__select__svg > .x-refine__multi-select-checkbox'
    const NUMBER_OF_RESULTS_SPAN_SELECTOR = '#mainContent > div.s-answer-region.s-answer-region-center-top > div > div:nth-child(2) > div:nth-child(1) > div.srp-controls__control.srp-controls__count > h1 > span:nth-child(1)'
    const PUMA_SHOES_ORDERED_BY_PRICE_URL = 'https://www.ebay.com/sch/i.html?_from=R40&_nkw=shoes&_sacat=0&Brand=PUMA&US%2520Shoe%2520Size%2520%2528Men%2527s%2529=10&_dcat=93427&_sop=15'
    const ARRAYS_LENGTH = 5
    const PRODUCT_TITLE_SPAN_SELECTOR = '.s-item__title'
    const PRODUCT_PRICE_SPAN_SELECTOR = '.s-item__price'
    const CURRENCY_REGEX = /\$[0-9]*\s[0-9]*.[0-9]*/

    it('Visit ebay.com', function () {
        cy.visit(BASE_URL)
    })

    it('Search for Puma shoes with size = 10', function () {
        cy.wait(WAI_TIME_MILLISECONDS)
        cy.get(INPUT_SEARCH_SELECTOR).type(SEARCH_STRING)
        cy.wait(WAI_TIME_MILLISECONDS)     
        cy.get(SEARCH_BUTTON_SELECTOR).click()
        cy.wait(WAI_TIME_MILLISECONDS)
        cy.get(PUMA_BRAND_CHECKBOX_SELECTOR).click()
        cy.get(SHOES_SIZE10_CHECKBOX_SELECTOR).click()
        cy.get(NUMBER_OF_RESULTS_SPAN_SELECTOR).then((resultsSpan) => {
            cy.log('There are ' + resultsSpan.text() + ' results')
        })
    })

    it('Order shoes (Puma, Size 10) by price ascendant', function () {
        cy.visit(PUMA_SHOES_ORDERED_BY_PRICE_URL)
        var orderAssert = true
        var assertMsg = 'The shoes were ordered by price ascendant properly'
        var previousItemPrice = 0.0
        var names = []
        var prices = []
        cy.get(PRODUCT_TITLE_SPAN_SELECTOR).each((element, index, list) => {
            if (index < ARRAYS_LENGTH) {
                names.push(element.text())
            }
        })
        cy.get(PRODUCT_PRICE_SPAN_SELECTOR).each((element, index, list) => {
            var currentItemPrice
            var currentItemPriceText            
            if (index < ARRAYS_LENGTH) {
                currentItemPriceText = element.text().match(CURRENCY_REGEX)
                currentItemPrice = parseFloat(currentItemPriceText.toString().replace('\$', '').replace(/\s/g, ''))
                prices.push(currentItemPriceText)
            }
            if (index <= ARRAYS_LENGTH && orderAssert) {
                if (currentItemPrice < previousItemPrice) {
                    orderAssert = false
                    assertMsg = 'The price of the item ' + (index + 1) + ' is lower than the price of the item ' + index
                }
                previousItemPrice = currentItemPrice
            }
        }).then(function () {
            for (var i = 0; i < ARRAYS_LENGTH; i++) {
                cy.log('Product Name: ' + names[i] + ' / Price: ' + prices[i])
            }
        }).then(function () {
            assert.isOk(orderAssert, assertMsg)
        })
    })

    it('Print shoes (Puma, Size 10) ordered by name ascendant', function () {
        var names = []
        cy.get(PRODUCT_TITLE_SPAN_SELECTOR).each((element, index, list) => {
            names.push(element.text())
        }).then(function () {
            names.sort()
            for (var i = 0; i < names.length; i++) {
                cy.log(names[i])
            }
        })
    })

    it('Print shoes (Puma, Size 10) ordered by price descendant', function () {
        var names = []
        var prices = []
        var currentItemPriceText
        var currentItemPrice
        var products = []
        var product
        cy.get(PRODUCT_TITLE_SPAN_SELECTOR).each((element, index, list) => {
            names.push(element.text())
        })
        cy.get(PRODUCT_PRICE_SPAN_SELECTOR).each((element, index, list) => {
            currentItemPriceText = element.text().match(CURRENCY_REGEX)
            currentItemPrice = parseFloat(currentItemPriceText.toString().replace('\$', '').replace(/\s/g, ''))
            prices.push(currentItemPrice)
        }).then(function () {
            for (var i = 0; i < names.length; i++) {
                product = {
                    name: names[i],
                    price: prices[i]
                }
                products.push(product)
            }
        }).then(function () {
            products.sort(function (a, b) {
                if (a.price > b.price) {
                    return -1
                } else if (b.price > a.price) {
                    return 1
                }
                return 0
            })
            for (var i = 0; i < products.length; i++) {
                cy.log('Product Name: ' + products[i].name + ' / Price: ' + products[i].price)
            }
        })
    })
})