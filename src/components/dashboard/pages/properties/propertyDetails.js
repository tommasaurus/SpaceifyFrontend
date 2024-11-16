// src/components/properties/PropertyDetails.js

import React, { useState } from "react";
import "./propertyDetails.css";
import { toast } from "react-toastify";

const PropertyDetails = ({
  property,
  onClose,
  onDelete,
  contracts = [],
  documents = [],
  expenses = [],
  incomes = [],
  invoices = [],
  leases = [],
  payments = [],
  tenants = [],
  vendors = [],
}) => {
  const [activeTab, setActiveTab] = useState("tenants");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Delete confirmation modal
  const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
      <div className="delete-modal-overlay">
        <div className="delete-modal">
          <h3>Confirm Delete</h3>
          <p>
            Are you sure you want to delete this property? This action cannot be
            undone and will delete all associated data including:
          </p>
          <ul>
            <li>Leases and tenant information</li>
            <li>Financial records (expenses, incomes, invoices)</li>
            <li>Documents and contracts</li>
            <li>Utility records</li>
          </ul>
          <div className="delete-modal-buttons">
            <button
              className="cancel-button"
              onClick={onCancel}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              className="delete-button"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Property"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleDeleteConfirm = async () => {
    if (!property?.id) {
      console.error("No property ID found");
      toast.error("Invalid property ID");
      return;
    }

    try {
      setIsDeleting(true);
      console.log("Attempting to delete property:", property.id);
      await onDelete(property.id);
      setShowDeleteModal(false); // Close the modal on success
      onClose(); // Close the property details
    } catch (error) {
      console.error("Delete confirmation error:", error);
      toast.error("Failed to delete property. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper functions
  const formatCurrency = (value) => {
    const num = Number(value);
    return !isNaN(num) ? `$${num.toFixed(2)}` : "N/A";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getPropertyAge = () => {
    if (!property.purchase_date) return "N/A";

    const purchaseDate = new Date(property.purchase_date);
    const today = new Date();

    const years = today.getFullYear() - purchaseDate.getFullYear();
    const months = today.getMonth() - purchaseDate.getMonth();

    if (months < 0) {
      return `${years - 1} years, ${months + 12} months`;
    }

    if (years === 0) {
      return `${months} months`;
    }

    return `${years} years, ${months} months`;
  };

  // Filter data for current property
  const propertyContracts = contracts.filter(
    (c) => c.property_id === property.id
  );
  const propertyDocuments = documents.filter(
    (d) => d.property_id === property.id
  );
  const propertyExpenses = expenses.filter(
    (e) => e.property_id === property.id
  );
  const propertyIncomes = incomes.filter((i) => i.property_id === property.id);
  const propertyInvoices = invoices.filter(
    (i) => i.property_id === property.id
  );
  const propertyLeases = leases.filter((l) => l.property_id === property.id);
  const propertyPayments = payments.filter(
    (p) => p.property_id === property.id
  );

  const currentTenantIds = propertyLeases
    .filter((lease) => lease.is_active)
    .map((lease) => lease.tenant_id);
  const propertyTenants = tenants.filter((t) =>
    currentTenantIds.includes(t.id)
  );

  const formatLeaseTerms = (specialLeaseTerms) => {
    if (!specialLeaseTerms || typeof specialLeaseTerms !== "object") {
      return (
        <div className="lease-terms">
          <div className="lease-term-item">No special terms</div>
        </div>
      );
    }

    return (
      <div className="lease-terms">
        {/* Late Payment Section */}
        {specialLeaseTerms.late_payment && (
          <div className="lease-term-item">
            <div className="lease-term-heading">Late Payment Fees</div>
            <div className="lease-term-value">
              Initial Fee: {specialLeaseTerms.late_payment.initial_fee}
              {specialLeaseTerms.late_payment.daily_late_charge && (
                <>
                  <div className="lease-term-separator" />
                  Daily Late Charge:{" "}
                  {specialLeaseTerms.late_payment.daily_late_charge}
                </>
              )}
            </div>
          </div>
        )}

        {/* Additional Fees Section */}
        {specialLeaseTerms.additional_fees?.map((fee, index) => (
          <div key={index} className="lease-term-item">
            <div className="lease-term-heading">{fee.fee_type}</div>
            <div className="lease-term-value">
              {fee.fee_type === "Animal Violation Fee" ? (
                <>
                  First Violation: {fee.first_violation}
                  <div className="lease-term-separator" />
                  Additional Violations: {fee.additional_violation}
                </>
              ) : (
                fee.amount
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="property-modal">
      <div className="property-modal-content">
        <div className="modal-header">
          <h2>{property.address}</h2>
          <div className="modal-header-buttons">
            <button
              className="delete-property-button"
              onClick={() => setShowDeleteModal(true)} // CORRECT
            >
              Delete Property
            </button>
            <button className="modal-close-button" onClick={onClose}>
              ×
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />

        <div className="modal-body">
          {/* Property Overview */}
          <div className="overview-grid">
            <div className="overview-card">
              <h3>Property Details</h3>
              <dl>
                <dt>Type</dt>
                <dd>{property.property_type || "N/A"}</dd>
                <dt>Purchase Price</dt>
                <dd>{formatCurrency(property.purchase_price)}</dd>
                <dt>Owned For</dt>
                <dd>{getPropertyAge()}</dd>
              </dl>
            </div>

            <div className="overview-card">
              <h3>Structure</h3>
              <dl>
                <dt>Bedrooms</dt>
                <dd>{property.num_bedrooms || "N/A"}</dd>
                <dt>Bathrooms</dt>
                <dd>{property.num_bathrooms || "N/A"}</dd>
                <dt>Floors</dt>
                <dd>{property.num_floors || "N/A"}</dd>
              </dl>
            </div>

            <div className="overview-card">
              <h3>Fees & Status</h3>
              <dl>
                <dt>Property Type</dt>
                <dd>{property.is_commercial ? "Commercial" : "Residential"}</dd>
                <dt>HOA</dt>
                <dd>{property.is_hoa ? "Yes" : "No"}</dd>
                <dt>HOA Fee</dt>
                <dd>{formatCurrency(property.hoa_fee)}</dd>
              </dl>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <div className="tabs-list">
              {["tenants", "leases", "finances", "documents", "contracts"].map(
                (tab) => (
                  <button
                    key={tab}
                    className={`tab-button ${
                      activeTab === tab ? "active" : ""
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                )
              )}
            </div>

            {/* Tab Content */}
            {activeTab === "tenants" && (
              <table className="details-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {propertyTenants.map((tenant) => (
                    <tr key={tenant.id}>
                      <td>{`${tenant.first_name} ${tenant.last_name}`}</td>
                      <td>{tenant.email}</td>
                      <td>{tenant.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === "leases" && (
              <table className="details-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Monthly Rent</th>
                    <th>Lease Terms</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {propertyLeases.map((lease) => (
                    <tr key={lease.id}>
                      <td>{lease.lease_type}</td>
                      <td>{formatDate(lease.start_date)}</td>
                      <td>{formatDate(lease.end_date)}</td>
                      <td>{formatCurrency(lease.rent_amount_monthly)}</td>
                      <td className="p-4">
                        {formatLeaseTerms(lease.special_lease_terms)}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            lease.is_active ? "active" : "inactive"
                          }`}
                        >
                          {lease.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === "finances" && (
              <>
                <h3>Income</h3>
                <table className="details-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {propertyIncomes.map((income) => (
                      <tr key={income.id}>
                        <td>{formatDate(income.date_received)}</td>
                        <td>{formatCurrency(income.amount)}</td>
                        <td>{income.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h3>Expenses</h3>
                <table className="details-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Category</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {propertyExpenses.map((expense) => (
                      <tr key={expense.id}>
                        <td>{formatDate(expense.date_incurred)}</td>
                        <td>{formatCurrency(expense.amount)}</td>
                        <td>{expense.category}</td>
                        <td>{expense.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {activeTab === "documents" && (
              <table className="details-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Upload Date</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {propertyDocuments.map((doc) => (
                    <tr key={doc.id}>
                      <td>{doc.document_type}</td>
                      <td>{formatDate(doc.upload_date)}</td>
                      <td>{doc.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === "contracts" && (
              <table className="details-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {propertyContracts.map((contract) => (
                    <tr key={contract.id}>
                      <td>{contract.contract_type}</td>
                      <td>{formatDate(contract.start_date)}</td>
                      <td>{formatDate(contract.end_date)}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            contract.is_active ? "active" : "inactive"
                          }`}
                        >
                          {contract.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
