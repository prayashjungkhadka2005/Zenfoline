import React from 'react';

const templates = [
    { id: 1, name: 'Developer', image: '' },
    { id: 2, name: 'Simple', image: '' },
    { id: 3, name: 'Expert', image: '' },
    { id: 4, name: 'Mixed', image: '' },
    { id: 5, name: 'Extra', image: '' },
    { id: 6, name: 'Beginner', image: '' },
];

const Templates = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Templates</h1>
                <button className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-md text-orange-600 font-medium">
                    Sort by <i className="fas fa-chevron-down"></i>
                </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {templates.map((template) => (
                    <div
                        key={template.id}
                        className="border rounded-lg overflow-hidden shadow-sm"
                    >
                        <img
                            src={template.image}
                            alt={template.name}
                            className="w-full h-40 object-cover"
                        />

                        <div className="p-4">
                            <h2 className="text-lg font-bold mb-2">{template.name}</h2>
                            <div className="flex justify-between">
                                <button className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm">
                                    Activate
                                </button>
                                <button className="bg-transparent border border-orange-500 text-orange-500 px-4 py-2 rounded-md text-sm">
                                    Live Preview
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Templates;
