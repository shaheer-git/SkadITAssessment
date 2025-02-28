const ApplicationsTable = () => {
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        phone: '',
        experience: '',
        resume: null,
        coverLetter: ''
    });
    const [applications, setApplications] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [editMode, setEditMode] = React.useState(false);
    const [editId, setEditId] = React.useState(null);
    const itemsPerPage = 5;

    setInterval(() => {
        fetchApplications();
    }, 3000);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const savedApplications = localStorage.getItem('applications');
            if (savedApplications) {
                setApplications(JSON.parse(savedApplications));
            } else {
                const response = await fetch('https://jsonplaceholder.typicode.com/users');
                const data = await response.json();
                setApplications(data);
            }
        } catch (err) {
            setError('Failed to fetch applications');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
                method: 'DELETE'
            });
            const updatedApplications = applications.filter(app => app.id !== id);
            setApplications(updatedApplications);
            localStorage.setItem('applications', JSON.stringify(updatedApplications));
        } catch (err) {
            setError('Delete failed');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (application) => {
        setEditMode(true);
        setEditId(application.id);
        setFormData({
            name: application.name || '',
            email: application.email || '',
            phone: application.phone || '',
            experience: application.experience || '',
            resume: null,
            coverLetter: application.coverLetter || ''
        });
    };

    const handleSubmit = async () => {
        // if (!validateForm()) return;

        try {
            setLoading(true);
            const url = editMode
                ? `https://jsonplaceholder.typicode.com/posts/${editId}`
                : 'https://jsonplaceholder.typicode.com/posts';
            const method = editMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Submission failed');

            if (editMode) {
                const updatedApplications = [...applications].map(app =>
                    app.id === editId ? { ...app, ...formData } : app
                );
                setApplications(updatedApplications);
                setEditMode(false);
                setEditId(null);
                localStorage.setItem('applications', JSON.stringify(updatedApplications));
            } else {
                const newApplication = { ...formData, id: Date.now() };
                setApplications([...applications, newApplication]);
                localStorage.setItem('applications', JSON.stringify([...applications, newApplication]));
            }

            setFormData({
                name: '',
                email: '',
                phone: '',
                experience: '',
                resume: null,
                coverLetter: ''
            });

            console.log('Application submitted successfully! Email notification sent.');

        } catch (err) {
            setError('Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = applications.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(applications.length / itemsPerPage);

    return (
        <div className="max-w-4xl mx-auto relative" id="applications-table" >
            <h2 className="text-2xl font-bold text-accent mb-4 text-center">Submitted Applications</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {
                loading ? (
                    <div className="text-primary text-center">Loading...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg overflow-hidden">
                            <thead className="bg-primary text-accent">
                                <tr>
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Email</th>
                                    <th className="px-4 py-2">Phone</th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white text-primary">
                                {currentItems.map((application) => (
                                    <tr key={application.id} className="border-b">
                                        <td className="px-4 py-2">
                                            {editId == application.id ? <input
                                                className="border border-black px-2"
                                                type="text"
                                                id="fullName"
                                                placeholder="Enter your full name *"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            /> : <span>{application.name || application.fullName}</span>}
                                            {/* <span>{application.name || application.fullName}</span> */}
                                        </td>
                                        <td className="px-4 py-2">
                                            {editId == application.id ? <input
                                                className="border border-black px-2"
                                                type="email"
                                                id="email"
                                                placeholder="Enter your email *"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            /> : <span>{application.email}</span>}
                                            {/* <span>{application.email}</span> */}
                                        </td>
                                        <td className="px-4 py-2">
                                            {editId == application.id ? <input
                                                className="border border-black px-2"
                                                type="tel"
                                                id="phone"
                                                placeholder="Enter your phone number *"
                                                value={formData.phone.substring(0, 12)}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                                            /> : <span>{application.phone || 'N/A'}</span>}
                                            {/* <span>{application.experience || 'N/A'}</span> */}
                                        </td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => handleEdit(application)}
                                                className="bg-primary text-accent px-2 py-1 rounded mr-2 hover-scale"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(application.id)}
                                                className="bg-red-500 text-white px-2 py-1 rounded hover-scale"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => handleSubmit()}
                                                className={["bg-primary text-accent px-2 py-1 rounded ml-2 hover-scale opacity-25 focus:opacity-100"]}
                                                disabled={editId !== application.id}
                                            >
                                                ✔
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Pagination */}
                        <div className="flex justify-center mt-4">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`mx-1 px-3 py-1 rounded ${currentPage === page ? 'bg-gray-300 text-primary' : 'bg-primary text-accent border'}`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    </div>
                )
            }
        </div >
    );
};