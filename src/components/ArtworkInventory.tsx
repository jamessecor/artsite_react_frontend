import * as React from 'react';
import { useState, useMemo, useContext } from 'react';
import {
  Table,
  Form,
  Button,
  Container,
  Row,
  Col,
  Spinner,
  Modal,
  Badge,
  Stack
} from 'react-bootstrap';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { IArtwork, Groupings, GroupingsLabels } from '../models/Artwork';
import { AuthenticationContext } from './providers/AuthenticationProvider';
import ArtworkForm from './ArtworkForm';
import { BackgroundColorContext, isTooLightForDarkTheme } from './providers/BackgroundColorProvider';

interface IFilters {
  search: string;
  status: 'all' | 'available' | 'sold';
  location: string;
  buyer: string;
  grouping: string;
}

const ArtworkInventory: React.FC = () => {
  const { isLoggedIn } = useContext(AuthenticationContext);
  const { color } = useContext(BackgroundColorContext);
  const queryClient = useQueryClient();
  const [showArtworkForm, setShowArtworkForm] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<IArtwork | null>(null);

  const [filters, setFilters] = useState<IFilters>({
    search: '',
    status: 'all',
    location: '',
    buyer: '',
    grouping: ''
  });

  // Fetch all artworks
  const { data: artworks = [], isLoading, error } = useQuery({
    queryKey: ['artworks', 'inventory'],
    queryFn: async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/artworks`);
      return data;
    },
    enabled: isLoggedIn
  });

  // Get unique values for filters
  const { locations, buyers, groupings } = useMemo(() => {
    const locs = new Set<string>();
    const buys = new Set<string>();
    const groups = new Set<string>();

    artworks.forEach(artwork => {
      if (artwork.location) locs.add(artwork.location);
      if (artwork.buyerName) buys.add(artwork.buyerName);
      if (artwork.grouping) {
        artwork.grouping.forEach(g => groups.add(g));
      }
    });

    return {
      locations: Array.from(locs).sort(),
      buyers: Array.from(buys).sort(),
      groupings: Array.from(groups).sort((a, b) =>
        (GroupingsLabels[a as Groupings] || '').localeCompare(GroupingsLabels[b as Groupings] || '')
      )
    };
  }, [artworks]);

  // Filter artworks based on current filters
  const filteredArtworks = useMemo(() => {
    return artworks.filter(artwork => {
      // Filter by status
      if (filters.status === 'sold' && !artwork.saleDate) return false;
      if (filters.status === 'available' && artwork.saleDate) return false;

      // Filter by search term
      const searchLower = filters.search.toLowerCase();
      if (filters.search &&
        !artwork.title.toLowerCase().includes(searchLower) &&
        !artwork.media.toLowerCase().includes(searchLower)) {
        return false;
      }

      // Filter by location
      if (filters.location && artwork.location !== filters.location) return false;

      // Filter by buyer
      if (filters.buyer && artwork.buyerName !== filters.buyer) return false;

      // Filter by grouping
      if (filters.grouping &&
        (!artwork.grouping || !artwork.grouping.includes(filters.grouping as Groupings))) {
        return false;
      }

      return true;
    });
  }, [artworks, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditClick = (artwork: IArtwork) => {
    setSelectedArtwork(artwork);
    setShowArtworkForm(true);
  };

  const getStatusBadge = (artwork: IArtwork) => {
    if (artwork.isNFS) return <Badge bg="secondary">NFS</Badge>;
    return artwork.saleDate
      ? <Badge bg="success">Sold</Badge>
      : <Badge bg="primary">Available</Badge>;
  };

  const textColor = useMemo(() => isTooLightForDarkTheme(color.r, color.g, color.b) ? 'dark-text' : 'light-text', [color]);

  if (!isLoggedIn) {
    return (
      <Container className={textColor + ' mt-4 text-center'}>
        <h3>Please log in to access the inventory</h3>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container className={textColor + ' mt-4 text-center'}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className={textColor + ' mt-4 text-center'}>
        <div className="alert alert-danger">Error loading artworks: {error.message}</div>
      </Container>
    );
  }

  return (
    <Container className={textColor + ' mt-4'}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Artwork Inventory</h2>
      </div>

      {/* Filters */}
      <div className="mb-4 p-3 border rounded">
        <h5>Filters</h5>
        <Row>
          <Col md={3} className="mb-3">
            <Form.Group>
              <Form.Label>Search</Form.Label>
              <Form.Control
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by title or media"
              />
            </Form.Group>
          </Col>
          <Col md={2} className="mb-3">
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="all">All</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2} className="mb-3">
            <Form.Group>
              <Form.Label>Location</Form.Label>
              <Form.Select
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
              >
                <option value="">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2} className="mb-3">
            <Form.Group>
              <Form.Label>Buyer</Form.Label>
              <Form.Select
                name="buyer"
                value={filters.buyer}
                onChange={handleFilterChange}
                disabled={filters.status === 'available'}
              >
                <option value="">All Buyers</option>
                {buyers.map(buyer => (
                  <option key={buyer} value={buyer}>{buyer}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2} className="mb-3">
            <Form.Group>
              <Form.Label>Grouping</Form.Label>
              <Form.Select
                name="grouping"
                value={filters.grouping}
                onChange={handleFilterChange}
              >
                <option value="">All Groupings</option>
                {groupings.map(grouping => (
                  <option key={grouping} value={grouping}>
                    {GroupingsLabels[grouping as Groupings] || grouping}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Stack direction={'horizontal'} gap={2} className={'align-items-center'}>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setFilters({
              search: '',
              status: 'all',
              location: '',
              buyer: '',
              grouping: ''
            })}
          >
            Clear Filters
          </Button>
          <Badge bg="primary">{filteredArtworks.length} artworks</Badge>
        </Stack>
      </div>

      {/* Artworks Table */}
      <div className="table-responsive">
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Title</th>
              <th>Year</th>
              <th>Media</th>
              <th>Dimensions</th>
              <th>Price</th>
              <th>Status</th>
              <th>Location</th>
              <th>Buyer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredArtworks.length > 0 ? (
              filteredArtworks.map(artwork => (
                <tr key={artwork._id}>
                  <td>{artwork.title}</td>
                  <td>{artwork.year}</td>
                  <td>{artwork.media}</td>
                  <td>{artwork.width} x {artwork.height}</td>
                  <td>${artwork.price}</td>
                  <td>{getStatusBadge(artwork)}</td>
                  <td>{artwork.location || 'N/A'}</td>
                  <td>{artwork.buyerName || 'N/A'}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEditClick(artwork)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center">No artworks found matching the selected filters</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <ArtworkForm
        artwork={selectedArtwork}
        show={showArtworkForm}
        onClose={() => {
          setSelectedArtwork(null);
          setShowArtworkForm(false);
        }}
      />
    </Container>
  );
};

export default ArtworkInventory;