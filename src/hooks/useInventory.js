import { useState, useCallback } from 'react';
import inventoryApi from '../api/inventory';
import { toast } from 'react-toastify';

export default function useInventory() {
  const [isLoading, setIsLoading] = useState(false);
  const [inventories, setInventories] = useState([]);
  const [inventory, setInventory] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [allocationHistory, setAllocationHistory] = useState([]);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalWarehouses: 0,
    totalModels: 0,
  });

  // Fetch all inventory with optional filters
  const fetchInventories = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await inventoryApi.getAllInventory(filters);
      setInventories(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu kho');
      toast.error('Không thể tải dữ liệu kho. Vui lòng thử lại sau.');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch inventory details by ID
  const fetchInventoryById = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await inventoryApi.getInventoryById(id);
      setInventory(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải chi tiết kho');
      toast.error('Không thể tải chi tiết kho. Vui lòng thử lại sau.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create new inventory
  const createInventory = useCallback(async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await inventoryApi.createInventory(data);
      toast.success('Thêm mới kho thành công');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi thêm kho');
      toast.error('Không thể thêm mới kho. Vui lòng thử lại sau.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update inventory
  const updateInventory = useCallback(async (id, data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await inventoryApi.updateInventory(id, data);
      toast.success('Cập nhật kho thành công');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật kho');
      toast.error('Không thể cập nhật kho. Vui lòng thử lại sau.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete inventory
  const deleteInventory = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await inventoryApi.deleteInventory(id);
      toast.success('Xóa kho thành công');
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi xóa kho');
      toast.error('Không thể xóa kho. Vui lòng thử lại sau.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch all warehouses
  const fetchWarehouses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await inventoryApi.getAllWarehouses();
      setWarehouses(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách kho');
      toast.error('Không thể tải danh sách kho. Vui lòng thử lại sau.');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create new warehouse
  const createWarehouse = useCallback(async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await inventoryApi.createWarehouse(data);
      toast.success('Thêm mới kho thành công');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi thêm kho');
      toast.error('Không thể thêm mới kho. Vui lòng thử lại sau.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Allocate vehicles to dealers
  const allocateVehicles = useCallback(async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await inventoryApi.allocateVehicles(data);
      toast.success('Phân bổ xe thành công');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi phân bổ xe');
      toast.error('Không thể phân bổ xe. Vui lòng thử lại sau.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch allocation history
  const fetchAllocationHistory = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await inventoryApi.getAllocationHistory(filters);
      setAllocationHistory(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải lịch sử phân bổ');
      toast.error('Không thể tải lịch sử phân bổ. Vui lòng thử lại sau.');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Import vehicles
  const importVehicles = useCallback(async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await inventoryApi.importVehicles(data);
      toast.success('Nhập kho xe thành công');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi nhập kho xe');
      toast.error('Không thể nhập kho xe. Vui lòng thử lại sau.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get inventory statistics
  const getInventoryStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real application, you would make an API call to get statistics
      // Here we'll simulate it by calculating from existing data
      const calculatedStats = {
        totalVehicles: inventories.reduce((sum, item) => sum + item.available, 0),
        totalWarehouses: warehouses.length,
        totalModels: new Set(inventories.map(item => item.model)).size,
      };
      setStats(calculatedStats);
      return calculatedStats;
    } catch (err) {
      setError('Có lỗi xảy ra khi tải thống kê kho');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [inventories, warehouses]);

  return {
    isLoading,
    inventories,
    inventory,
    warehouses,
    allocationHistory,
    error,
    stats,
    fetchInventories,
    fetchInventoryById,
    createInventory,
    updateInventory,
    deleteInventory,
    fetchWarehouses,
    createWarehouse,
    allocateVehicles,
    fetchAllocationHistory,
    importVehicles,
    getInventoryStats,
  };
}