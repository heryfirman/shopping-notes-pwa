import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { fetchProducts } from "../services/service";
import { Link } from "react-router-dom";
import { IoAdd } from "react-icons/io5";

type TypeProduct = {
  id: string;
  name: string;
  price: number;
  unit: string;
  categoryId: string;
  productUnits: { unit: { name: string } } [];
}

const Products = () => {
  const [products, setProducts] = useState<TypeProduct[]>([]);

  const getProducts = async () => {
    const products = await fetchProducts();
    setProducts(products);
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <Layout>
      <header className="flex justify-between items-center w-full gap-2 mb-4">
        <Link to='/product/create' className="flex items-center gap-2 px-4 py-2 rounded-4xl border border-gray-300">
            <IoAdd className="text-2xl" />
            <span>Add Product</span>
        </Link>
      </header>

      <main>
        <ul>
           {products.map((product) => (
            <li key={product.id} className="py-4 border-b border-gray-200">
                <h4 className="text-lg font-semibold">{product.name}</h4>
                <p className="text-gray-600">Price: {product.price}</p>
                <div className="flex gap-2 mt-2">
                  <span className="font-medium">Units:</span>
                    {product.productUnits.length > 0 ? (
                      product.productUnits.map((pu, index) => (
                        <span key={index} className="bg-gray-600 px-2 py-1 rounded-md">
                          {pu.unit.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">No Units</span>
                    )}
                </div>
                <Link to={`/product/edit/${product.id}`}>
                    <button className="text-2xl cursor-pointer">Edit</button>
                </Link>
            </li>
           ))}
        </ul>
      </main>
    </Layout>
  )
}

export default Products

// "productUnits": [
//       {
//         "productId": "19a6aff9-9707-4100-a94e-3210a3504ef1",
//         "unitId": "4d9410a8-1271-4f52-809a-43e1d9d5f5c6",
//         "unit": {
//           "id": "4d9410a8-1271-4f52-809a-43e1d9d5f5c6",
//           "name":