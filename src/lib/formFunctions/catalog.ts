import { FieldOption } from "@/app/_components/form-renderer";

export const getDepartments = () => [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'home', label: 'Home & Garden' }
]

export const getCategories = (deptId: string) => {
    const categories: { [key: string]: FieldOption[] } = {
        'electronics': [
            { value: 'phones', label: 'Mobile Phones' },
            { value: 'computers', label: 'Computers' },
            { value: 'audio', label: 'Audio & Video' }
        ],
        'clothing': [
            { value: 'mens', label: "Men's Clothing" },
            { value: 'womens', label: "Women's Clothing" },
            { value: 'kids', label: "Kids' Clothing" }
        ]
    };
    return categories[deptId] || [];
}

export const getSubcategories = (catId: string) => {
    const subcategories: { [key: string]: FieldOption[] } = {
        'phones': [
            { value: 'smartphones', label: 'Smartphones' },
            { value: 'accessories', label: 'Phone Accessories' }
        ],
        'computers': [
            { value: 'laptops', label: 'Laptops' },
            { value: 'desktops', label: 'Desktop Computers' }
        ]
    };
    return subcategories[catId] || [];
}

export const getProducts = (subcatId: string) => {
    const products: { [key: string]: FieldOption[] } = {
        'smartphones': [
            { value: 'iphone14', label: 'iPhone 14 Pro' },
            { value: 'samsung-s23', label: 'Samsung Galaxy S23' }
        ],
        'laptops': [
            { value: 'macbook-pro', label: 'MacBook Pro 16"' },
            { value: 'dell-xps', label: 'Dell XPS 13' }
        ]
    };
    return products[subcatId] || [];
}