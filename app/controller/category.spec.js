const categoryController = require("./categoryController");
const { sequelize } = require("../models");

const { queryInterface } = sequelize;

beforeAll(async () => {
    await queryInterface.bulkInsert("Category", [
        {
            nama: "elektronik"
        },
    ], {});
});

afterAll(async () => {
    await queryInterface.bulkDelete("Category", null, {
        truncate: true,
        restartIdentity: true
    });
});

describe('Category Controller', () => {
    describe('#getListCategories', () => {
        it('should return success 200', async () => {
            const mockRequest = {};
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            };

            await categoryController.getListCategories(mockRequest, mockResponse);

            expect (mockResponse.status).toHaveBeenCalledWith(200);
            expect (mockResponse.json).toHaveBeenCalledWith({
                status: "Categories fetched successfully",
                categories: expect.any(Array)
            });
        });
    });

    describe('#getListCategoriesById', () => {
        it('should return sucess 200', async () => {
            const mockRequest = {
                params: {
                    id: 1
                },
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            };

            await categoryController.getListCategoriesById(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: "Categories By Id fetched successfully",
                Category: expect.any(Object)
            });
        });
    });

    describe('#createCategory', () => {
        it('should return success 201', async () => {
            const mockRequest = {
                body: {
                    nama: "Alat Mandi"
                },
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            };

            await categoryController.createCategory(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: "Category created successfully",
                category: expect.any(Object)
            });
        });
    });

    describe('#updateCategory', () => {
        it('should return success 200', async () => {
            const mockRequest = {
                params: {
                    id: 1
                },
                body: {
                    nama: "Alat Masak"
                },
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            };

            await categoryController.updateCategory(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: "Category updated successfully",
                category: expect.any(Object)
            });
        });
    });

    describe('#deleteCategory', () => {
        it('should return success 200', async () => {
            const mockRequest = {
                params: {
                    id: 1
                },
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            };

            await categoryController.deleteCategory(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                status: "Category deleted successfully",
                category: expect.any(Object)
            });
        });
    });
});