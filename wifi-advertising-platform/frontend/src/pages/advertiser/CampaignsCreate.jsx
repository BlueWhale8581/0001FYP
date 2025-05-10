import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useCampaigns } from '../../hooks/useAdvertiser';

const CampaignsCreatePage = () => {
  const { isAuthenticated, user } = useAuth();
  const { createCampaign } = useCampaigns();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    budget: '',
    target_audience: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createCampaign(formData);
      setSuccess(true);
      setFormData({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        budget: '',
        target_audience: '',
      });
    } catch (err) {
      setError(err.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <DashboardTemplate
        role="user"
        userName="Visitor"
        pageTitle="Create Campaign"
      >
        <p className="text-center text-gray-500">Please log in to create a campaign.</p>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate
      role="advertiser"
      userName={user?.name || "Advertiser"}
      pageTitle="Create Campaign"
    >
      <Card title="Create New Campaign">
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">Campaign created successfully!</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Campaign Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">End Date</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700">Budget</label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Target Audience</label>
            <textarea
              name="target_audience"
              value={formData.target_audience}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <Button text={loading ? 'Creating...' : 'Create Campaign'} type="submit" disabled={loading} />
        </form>
      </Card>
    </DashboardTemplate>
  );
};

export default CampaignsCreatePage;