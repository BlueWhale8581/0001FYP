import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useCampaigns } from '../../hooks/useAdvertiser';

const CampaignsEditPage = () => {
  const { isAuthenticated, user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const { campaigns, updateCampaign } = useCampaigns();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const campaign = campaigns.find((c) => c.id === parseInt(id, 10));
        if (!campaign) {
          throw new Error('Campaign not found');
        }
        setFormData(campaign);
      } catch (err) {
        setLoadError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id, campaigns]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to update this campaign?')) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateCampaign(id, formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/campaigns');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update campaign');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <DashboardTemplate
        role="user"
        userName="Visitor"
        pageTitle="Edit Campaign"
      >
        <p className="text-center text-gray-500">Please log in to edit a campaign.</p>
      </DashboardTemplate>
    );
  }

  if (isLoading) {
    return (
      <DashboardTemplate role="advertiser" userName={user?.name || "Advertiser"} pageTitle="Edit Campaign">
        <Card>
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading campaign data...</p>
          </div>
        </Card>
      </DashboardTemplate>
    );
  }

  if (loadError) {
    return (
      <DashboardTemplate role="advertiser" userName={user?.name || "Advertiser"} pageTitle="Edit Campaign">
        <Card>
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">{loadError}</p>
          </div>
        </Card>
      </DashboardTemplate>
    );
  }

  if (!formData) {
    return <p>Loading campaign data...</p>;
  }

  return (
    <DashboardTemplate
      role="advertiser"
      userName={user?.name || "Advertiser"}
      pageTitle="Edit Campaign"
    >
      <Card title="Edit Campaign">
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">Campaign updated successfully!</p>}
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
          <Button text={loading ? 'Updating...' : 'Update Campaign'} type="submit" disabled={loading} />
        </form>
      </Card>
    </DashboardTemplate>
  );
};

export default CampaignsEditPage;