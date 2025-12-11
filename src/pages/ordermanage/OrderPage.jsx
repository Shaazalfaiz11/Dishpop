import React, { useEffect, useState } from "react";
import OrderColumn from "../../components/orders/OrderColumn";
import { getRestaurantOrders, updateOrderStatus } from "../../api/orderApi";
import io from "socket.io-client";

const socket = io("http://localhost:5001");

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const restaurantId = "restaurant123";

  const loadOrders = async () => {
    const { data } = await getRestaurantOrders(restaurantId);
    setOrders(data.orders);
  };

  useEffect(() => {
    loadOrders();
    socket.emit("joinRoom", restaurantId);

    socket.on("newOrder", (order) => {
      setOrders((prev) => [order, ...prev]);
    });

    socket.on("orderStatusUpdated", (updated) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === updated._id ? updated : o))
      );
    });

    return () => {
      socket.off("newOrder");
      socket.off("orderStatusUpdated");
    };
  }, []);

  const handleUpdate = async (id, status) => {
    await updateOrderStatus(id, status);
    loadOrders();
  };

  return (
    <div className="p-4 flex gap-4 overflow-x-auto">
      <OrderColumn
        title="Pending"
        orders={orders.filter((o) => o.status === "pending")}
        onUpdate={handleUpdate}
      />

      <OrderColumn
        title="Preparing"
        orders={orders.filter((o) => o.status === "preparing")}
        onUpdate={handleUpdate}
      />

      <OrderColumn
        title="Ready"
        orders={orders.filter((o) => o.status === "ready")}
        onUpdate={handleUpdate}
      />

      <OrderColumn
        title="Completed"
        orders={orders.filter((o) => o.status === "completed")}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default OrdersPage;
