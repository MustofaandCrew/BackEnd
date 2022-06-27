const categoryController = require('./categoryController');
// const { sequelize } = require('../models');
const { array } = require('../../middleware/multer');
// const { queryInterface } = sequelize;

const { Category } = require('../models');
// beforeAll(async () => {
//     await queryInterface.bulkInsert('Category', [
//         {
//             nama: 'Elektronik',
//             createdAt: new Date(),
//             updatedAt: new Date(),
//         }
//     ], {});
// });

// afterAll(async () => {
//     await queryInterface.bulkDelete('Category', null, {
//         truncate: true,
//         restartIdentity: true,
//     });
// });

// afterAll( async () => {
//     await Category.destroy({
//         where: { 
//             nama: "Elektronik",
//         },
//     });
// });

describe('Category Controller', () => {
    describe('#getListCategories() WithContent', () => {
        beforeEach(async () => {
            await Category.create({
                nama: "Elektronik"
            })
        });
        afterAll(async() => {
            await Category.destroy({
                where: {
                    nama: "Elektronik",
                }
            })
        });

        it('should return all categories success 200', async () => {
            const mockRequest = {};
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };
            
            await categoryController.getListCategories(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: expect.any(String),
                data: expect.any(Array),
            });
        });
    });

    describe('#getListCategories() NoContent', () => {
        it('No Content status 204', async () => {
            const mockRequest = {};
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                end: jest.fn().mockReturnThis(),
            };
            
            await categoryController.getListCategories(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.end).toHaveBeenCalled();
        });
    });

    describe('#getListCategoriesById() WithContent', () => {
        beforeEach(async () => {
            await Category.create({
                id: 1,
                nama: "Elektronik"
            })
        });
        afterAll(async() => {
            await Category.destroy({
                where: {
                    nama: "Elektronik",
                }
            })
        });
        it('should return a list of categories success 200', async () => {
            const mockRequest = {
                params: {
                    id: 1,
                },
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            };

            await categoryController.getListCategoriesById(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: expect.any(String),
                data: expect.any(Object)
            });
        });
    });

    describe('#getListCategoriesById() NotFound', () => {
        it('should return a list of categories NotFound 404', async () => {
            const mockRequest = {
                params: {
                    id: 12
                },
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            };

            await categoryController.getListCategoriesById(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                errors: [
                    {
                      code: expect.any(String),
                      message: expect.any(String),
                    },
                  ],
            });
        });
    });

    describe('#createCategory()', () => {
        it('should create a new category success 201', async () => {
            const mockRequest = {
                body: {
                    nama: "Elektronik",
                },
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };

            await categoryController.createCategory(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: expect.any(String),
                data: expect.any(Object),
            });
        });
    });

    describe('#updateCategory() Success', () => {
        beforeEach(async () => {
            await Category.create({
                id: 1,
                nama: "Elektronik"
            })
        });
        afterAll(async() => {
            await Category.destroy({
                where: {
                    nama: "Elektronik",
                }
            })
        });
        it('should update the category success 200', async () => {
            const mockRequest = {
                params: {
                    id:1
                },
                body: {
                    nama: "kendaraan",
                }
            };
            const mockResponse = {
                json: jest.fn().mockReturnThis(),
                status: jest.fn().mockReturnThis(),
            };

            await categoryController.updateCategory(mockRequest, mockResponse);
            
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: expect.any(String),
            });
        });
    });

    describe('#updateCategory() NotFound', () => {
        beforeEach(async () => {
            await Category.create({
                nama: "Elektronik"
            })
        });
        afterAll(async() => {
            await Category.destroy({
                where: {
                    nama: "Elektronik",
                }
            })
        });
        it('Category not found 404 error', async () => {
            const mockRequest = {
                params: {
                    id:2
                }
            };
            const mockResponse = {
                json: jest.fn().mockReturnThis(),
                status: jest.fn().mockReturnThis(),
            };

            await categoryController.updateCategory(mockRequest, mockResponse);
            
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                errors: [
                    {
                      code: expect.any(String),
                      message: expect.any(String),
                    },
                  ],
            });
        });
    });

    describe('#updateCategory() Exist', () => {
        beforeEach(async () => {
            await Category.create({
                nama: "Elektronik"
            })
        });
        afterAll(async() => {
            await Category.destroy({
                where: {
                    nama: "Elektronik",
                }
            })
        });
        it('Category exist 400 error', async () => {
            const mockRequest = {
                params: {
                    id:1
                },
                body: {
                    nama: "Elektronik",
                }
            };
            const mockResponse = {
                json: jest.fn().mockReturnThis(),
                status: jest.fn().mockReturnThis(),
            };

            await categoryController.updateCategory(mockRequest, mockResponse);
            
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                errors: [
                    {
                      code: expect.any(String),
                      message: expect.any(String),
                    },
                  ],
            });
        });
    });

    describe('#deleteCategory() Success', () => {
        beforeEach(async () => {
            await Category.create({
                nama: "Elektronik"
            })
        });
        afterAll(async() => {
            await Category.destroy({
                where: {
                    nama: "Elektronik",
                }
            })
        });
        it('should delete a category success 200', async () => {
            const mockRequest = {
                params: {
                    id: 1,
                },
            };
            const mockResponse = {
                json: jest.fn().mockReturnThis(),
                status: jest.fn().mockReturnThis(),
            };

            await categoryController.deleteCategory(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: expect.any(String),
            });
        });
    });

    describe('#deleteCategory() NotFound', () => {
        it('Category is not found', async () => {
            const mockRequest = {
                params: {
                    id: 12,
                },
            };
            const mockResponse = {
                json: jest.fn().mockReturnThis(),
                status: jest.fn().mockReturnThis(),
            };

            await categoryController.deleteCategory(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                errors: [
                    {
                      code: expect.any(String),
                      message: expect.any(String),
                    },
                  ],
            });
        });
    });
});