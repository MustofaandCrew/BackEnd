const productController = require('./productController');

describe('productController', () => {
    
    describe('getListProducts', () => {
        it('should get all products', async () => {
        const req = {
            user: {
            id: 1,
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        const next = jest.fn();
        const product = await productController.getListProducts(req, res, next);
        expect(product).toBeDefined();
        });
    }
    );
    describe('getProductById', () => {
        it('should get product by id', async () => {
        const req = {
            params: {
            id: 1,
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        const next = jest.fn();
        const product = await productController.getProductById(req, res, next);
        expect(product).toBeDefined();
        });
    }
    );
    describe('getListProductUser', () => {
        it('should get all products of user', async () => {
        const req = {
            user: {
            id: 1,
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        const next = jest.fn();
        const product = await productController.getListProductUser(req, res, next);
        expect(product).toBeDefined();
        });
    }
    );

    describe('createProduct', () => {
        it('should create product', async () => {
        const req = {
            body: {
            name: 'test',
            price: 100,
            categoryId: 1,
            userId: 1,
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        const next = jest.fn();
        const product = await productController.createProduct(req, res, next);
        expect(product).toBeDefined();
        });
    }
    );

    describe('handleUpdateProduct', () => {
        it('should update product', async () => {
        const req = {
            params: {
            id: 1,
            },
            body: {
            name: 'test',
            price: 100,
            categoryId: 1,
            userId: 1,
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        const next = jest.fn();
        const product = await productController.handleUpdateProduct(req, res, next);
        expect(product).toBeDefined();
        });
    }
    );

    describe('handleDeleteProduct', () => {
        it('should delete product', async () => {
        const req = {
            params: {
            id: 1,
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        const next = jest.fn();
        const product = await productController.handleDeleteProduct(req, res, next);
        expect(product).toBeDefined();
        });
    }
    );

});