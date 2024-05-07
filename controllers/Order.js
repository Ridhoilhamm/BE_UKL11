import OrderList from "../models/OrderListModel.js";
import OrderDetail from "../models/OrderDetailModel.js";
import Food from "../models/FoodModel.js";
import db from "../config/Database.js";

export const createOrder = async (req, res) => {
    const { customer_name, table_number, order_detail } = req.body;

    // Mulai transaksi
    const transaction = await db.transaction();

    try {
        // Buat OrderList baru
        const orderList = await OrderList.create(
            {
                customer_name,
                table_number,
            },
            { transaction }
        );

        // Buat OrderDetail baru berdasarkan input order_detail
        for (const detail of order_detail) {
            const { foodId, quantity } = detail;

            // Dapatkan food berdasarkan foodId
            const food = await Food.findByPk(foodId, { transaction });

            if (!food) {
                throw new Error(`Food with id ${foodId} not found`);
            }

            // Hitung harga total berdasarkan quantity dan food price
            const totalPrice = quantity * food.price;

            // Buat OrderDetail baru
            await OrderDetail.create(
                {
                    orderListId: orderList.id,
                    foodId,
                    quantity,
                    price: totalPrice,
                },
                { transaction }
            );
        }

        // Commit transaksi
        await transaction.commit();

        // Berikan respons sukses
        res.status(201).json({ message: 'Order created successfully', orderList });

    } catch (error) {
        // Rollback transaksi jika ada error
        await transaction.rollback();

        // Tampilkan error ke pengguna
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        // Mengambil semua pesanan dari tabel OrderList
        const orders = await OrderList.findAll({
            include: [
                {
                    model: OrderDetail,
                    as: 'order_details',
                    include: [
                        {
                            model: Food,
                            as: 'food'
                        }
                    ]
                }
            ]
        });

        // Kembalikan respons sukses dengan daftar pesanan
        res.status(200).json(orders);

    } catch (error) {
        // Tampilkan error jika ada masalah dalam mengambil data
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

export const getOrder = async (req, res) => {
    const { orderListId } = req.params;

    try {
        // Dapatkan informasi dari OrderList berdasarkan orderListId
        const order = await OrderList.findOne({
            where: {
                id: orderListId
            },
            include: [
                {
                    model: OrderDetail,
                    as: 'order_details',
                    include: [
                        {
                            model: Food,
                            as: 'food'
                        }
                    ]
                }
            ]
        });

        // Cek apakah pesanan ditemukan
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Jika pesanan ditemukan, kembalikan informasi pesanan
        res.status(200).json(order);

    } catch (error) {
        // Tampilkan error jika ada masalah dalam mengambil data
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
};

// export const getAllOrder = async (req, res) => {
//   try {
//     const orders = await OrderList.findAll({
//       include: {
//         model: OrderDetail,
//         as: "order_details",
//       },
//     });

//     // Berikan respons sukses dengan data pesanan
//     res.json({
//       status: true,
//       data: orders,
//       message: "Successfully retrieved all orders",
//     });
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res.status(500).json({
//       status: false,
//       message: "Failed to retrieve orders",
//       error: error.message,
//     });
//   }
// };

// export const getAllOrder = async (req, res) => {
//     try {

//         const orders = await OrderList.findAll({
//             include: [
//                 {
//                     model: OrderDetail,
//                     as: 'order_details',
//                     include: [
//                         {
//                             model: Food,
//                             as: 'food'
//                         }
//                     ]
//                 }
//             ]
//         });

//         // Berikan respons sukses dengan data pesanan
//         res.json({
//             status: true,
//             data: orders,
//             message: "Successfully retrieved all orders"
//         });
//     } catch (error) {
//         console.error('Error fetching orders:', error);
//         res.status(500).json({
//             status: false,
//             message: "Failed to retrieve orders",
//             error: error.message
//         });
//     }
// };

// export const getAllOrder = async (req, res) => {
//     try {
//         const orders = await OrderList.findAll({
//             include: [
//                 {
//                     model: OrderDetail,
//                     as: 'order_details',
//                     include: [{
//                         model: Food,
//                         as: 'food'
//                     }]
//                 }
//             ]
//         });

//         res.json({
//             status: true,
//             data: orders,
//             msg: "Order List"
//         })
//     } catch (error) {
//         res.status(500).json({
//             status: false,
//             message: "Failed to retrieve orders",
//             error: error.message
//         });
//         console.log(error);
//     }
// }
