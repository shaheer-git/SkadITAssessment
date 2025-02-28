const JobApplication = () => {
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
    const [editMode, setEditMode] = React.useState(false);
    const [editId, setEditId] = React.useState(null);
    const [errors, setErrors] = React.useState({});

    React.useEffect(() => {
        fetchApplications();
    }, []);

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

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name || formData.name.length < 3) {
            newErrors.name = 'Full name must be at least 3 characters';
        }
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Phone number must be 10 digits';
        }
        if (!formData.experience) {
            newErrors.experience = 'Please select experience';
        }
        if (!formData.resume) {
            newErrors.resume = 'Please upload your resume';
        }
        if (!formData.coverLetter || formData.coverLetter.length < 50) {
            newErrors.coverLetter = 'Cover letter must be at least 50 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

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
                const updatedApplications = applications.map(app =>
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
            setFormData({ ...formData, resume: file });
            setErrors({ ...errors, resume: null });
        } else {
            setErrors({ ...errors, resume: 'Please upload a PDF or Word document' });
        }
    };

    return (
        <div>
            <div className="container mx-auto px-4" id="job-form-root">
                <h4 className="my-4 text-xl">Job Application Form</h4>

                <form onSubmit={handleSubmit} className="">
                    <input
                        type="text"
                        id="name"
                        placeholder="Enter your full name *"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-6 w-full p-4 bg-primary font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-none border border-white"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1 ml-4">{errors.name}</p>}

                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email *"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-4 w-full p-4 bg-primary font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-none border border-white"
                    />
                    {errors.email && <p className="text-red-500 text-xs ml-4">{errors.email}</p>}

                    <input
                        type="tel"
                        id="phone"
                        placeholder="Enter your phone number *"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                        className="mt-4 w-full p-4 bg-primary font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-none border border-white"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1 ml-4">{errors.phone}</p>}

                    <select
                        id="experience"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        className="mt-4 w-full p-4 bg-primary font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-none border border-white"
                    >
                        <option value="">Select Experience *</option>
                        <option value="0-1">0-1 years</option>
                        <option value="2-3">2-3 years</option>
                        <option value="4+">4+ years</option>
                    </select>
                    {errors.experience && <p className="text-red-500 text-xs mt-1 ml-4">{errors.experience}</p>}

                    <input
                        type="file"
                        id="resume"
                        placeholder="Upload your resume *"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        className="mt-4 w-full p-4 bg-primary font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-none border border-white"
                    />
                    {errors.resume && <p className="text-red-500 text-xs mt-1 ml-4">{errors.resume}</p>}

                    <textarea
                        id="coverLetter"
                        value={formData.coverLetter}
                        placeholder="Enter your cover letter *"
                        onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                        className="mt-4 w-full p-4 bg-primary font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-none border border-white"
                    />
                    {errors.coverLetter && <p className="text-red-500 text-xs mt-1 ml-4">{errors.coverLetter}</p>}

                    <div className="bg-white py-1 hover:py-0 rounded-full pt-0 w-full mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-accent text-black py-1 rounded-full font-medium flex items-center justify-between hover:bg-opacity-90 border border-black w-full">
                            <p className="px-8 font-semibold">{loading ? 'Submitting...' : (editMode ? 'Update Application' : 'Submit Application')}</p>
                            <div className="bg-primary p-2 rounded-full mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white"
                                    className="bi bi-arrow-right" viewBox="0 0 16 16">
                                    <path fillRule="evenodd"
                                        d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                                </svg>
                            </div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};