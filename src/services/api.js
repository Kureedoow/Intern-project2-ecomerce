export const fetchDummyJsonProducts = async () => {
  try {
    const response = await fetch('https://dummyjson.com/products');
    const data = await response.json();
    return data.products.map(product => ({
      id: `dummy_${product.id}`,
      title: product.title,
      price: product.price,
      image: product.thumbnail,
      description: product.description,
      category: product.category,
      source: 'dummyjson'
    }));
  } catch (error) {
    console.error("Error fetching DummyJSON products:", error);
    return [];
  }
};

export const fetchFakeStoreProducts = async () => {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const data = await response.json();
    return data.map(product => ({
      id: `fake_${product.id}`,
      title: product.title,
      price: product.price,
      image: product.image,
      description: product.description,
      category: product.category,
      source: 'fakestore'
    }));
  } catch (error) {
    console.error("Error fetching FakeStore products:", error);
    return [];
  }
};

export const fetchAllProducts = async () => {
  const [dummyProducts, fakeProducts] = await Promise.all([
    fetchDummyJsonProducts(),
    fetchFakeStoreProducts()
  ]);
  // Combine and maybe shuffle or just append
  return [...dummyProducts, ...fakeProducts];
};
