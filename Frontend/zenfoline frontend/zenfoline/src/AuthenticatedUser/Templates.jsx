import React, { useEffect, useState } from 'react';

const Templates = () => {
    const [templates, setTemplates] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await fetch('http://localhost:3000/user/templates');
                if (!response.ok) {
                    throw new Error('Failed to fetch templates');
                }
                const data = await response.json();
                setTemplates(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTemplates();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

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
                        key={template._id} 
                        className="border rounded-lg overflow-hidden shadow-sm"
                    >
                        <img

                            src={`http://localhost:3000${template.image}`}
                            alt={template.name}
                            className="w-full h-60 object-cover"
                        />

                        <div className="p-4 py-4">
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
