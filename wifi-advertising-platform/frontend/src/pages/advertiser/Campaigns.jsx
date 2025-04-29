import React from 'react';
import { PlusCircle, Edit, Trash2, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Template
import DashboardTemplate from '../../templates/DashboardTemplate';

// Common components
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusIndicator from '../../components/common/StatusIndicator';

// Hooks
import { useCampaigns } from '../../hooks/useAdvertiser';
import { useAuth } from '../../hooks/useAuth';

const CampaignsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const { campaigns, loading, error, deleteCampaign, updateCampaignStatus } = useCampaigns();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <DashboardTemplate
        role="user"
        userName="Visitor"
        pageTitle="Campaigns"
      >
        <p className="text-center text-gray-500">Please log in to view campaigns.</p>
      </DashboardTemplate>
    );
  }

  const handleCreateCampaign = () => {
    navigate('/advertiser/campaigns/create'); // Navigate to the campaign creation page
  };

  const handleEditCampaign = (campaignId) => {
    navigate(`/advertiser/campaigns/edit/${campaignId}`); // Navigate to the campaign edit page
  };

  const handleDeleteCampaign = async (campaignId) => {
    const confirmed = window.confirm('Are you sure you want to delete this campaign?');
    if (confirmed) {
      await deleteCampaign(campaignId);
    }
  };

  const handleUpdateStatus = async (campaignId, status) => {
    await updateCampaignStatus(campaignId, status);
  };

  if (loading) {
    return <p>Loading campaigns...</p>;
  }

  if (error) {
    return <p className="text-red-600">Error: {error}</p>;
  }

  return (
    <DashboardTemplate
      role="advertiser"
      userName={user?.name || "Advertiser"}
      pageTitle="Campaigns"
    >
      <Card title="Campaign Overview" actionText="Create Campaign" onActionClick={handleCreateCampaign}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Campaigns</p>
            <p className="text-xl font-bold text-purple-600">{campaigns.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Campaigns</p>
            <p className="text-xl font-bold text-purple-600">
              {campaigns.filter((campaign) => campaign.status === 'Active').length}
            </p>
          </div>
        </div>
      </Card>

      <Card title="Campaign List">
        {campaigns.length === 0 ? (
          <p className="text-gray-500">No campaigns available. Click "Create Campaign" to add one.</p>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded shadow-sm"
              >
                <div>
                  <p className="font-medium">{campaign.name}</p>
                  <p className="text-sm text-gray-500">{campaign.description || 'No description provided'}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <StatusIndicator status={campaign.status} />
                  <Button
                    text="Edit"
                    icon={<Edit size={16} />}
                    onClick={() => handleEditCampaign(campaign.id)}
                  />
                  <Button
                    text="Delete"
                    icon={<Trash2 size={16} />}
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => handleDeleteCampaign(campaign.id)}
                  />
                  {campaign.status === 'Active' ? (
                    <Button
                      text="Pause"
                      className="bg-yellow-500 hover:bg-yellow-600"
                      onClick={() => handleUpdateStatus(campaign.id, 'Paused')}
                    />
                  ) : (
                    <Button
                      text="Activate"
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => handleUpdateStatus(campaign.id, 'Active')}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </DashboardTemplate>
  );
};

export default CampaignsPage;