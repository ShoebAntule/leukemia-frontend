  import React, { useState, useEffect, useCallback } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Paper, CardActionArea, CardMedia, Grid, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Button, CircularProgress, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, List, ListItem, ListItemText, ListItemSecondaryAction } from "@material-ui/core";
import { Clear } from '@material-ui/icons';
import axios from "axios";
import { DropzoneArea } from 'material-ui-dropzone';
import Sidebar from '../common/Sidebar';
import Topbar from '../common/Topbar';
import { apiService } from '../../api/api';

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(theme.palette.common.white),
    backgroundColor: theme.palette.common.white,
    '&:hover': {
      backgroundColor: '#ffffff7a',
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  clearButton: {
    width: "100%",
    borderRadius: "30px",
    padding: "15px 22px",
    color: "#007bff",
    fontSize: "20px",
    fontWeight: 900,
    boxShadow: "0 4px 15px rgba(0, 123, 255, 0.4)",
    transition: "all 0.3s ease",
    '&:hover': {
      backgroundColor: "#0056b3",
      color: "white",
      boxShadow: "0 6px 20px rgba(0, 86, 179, 0.7)",
    }
  },
  root: {
    maxWidth: 600,
    flexGrow: 1,
    borderRadius: "20px",
    boxShadow: "0 8px 30px rgba(0, 123, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  uploadCard: {
    maxWidth: 450,
    flexGrow: 1,
    borderRadius: "20px",
    border: "2px dashed #007bff",
    boxShadow: "0 4px 15px rgba(0, 123, 255, 0.1)",
    backgroundColor: "white",
  },
  media: {
    height: 400,
    borderRadius: "20px 20px 0 0",
    objectFit: "contain",
    maxWidth: "100%",
    maxHeight: "400px",
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  gridContainer: {
    justifyContent: "center",
    padding: "3em 1em 0 1em",
  },
  mainContainer: {
    background: 'linear-gradient(135deg, #e3f2fd 0%, #f8f9ff 100%)',
    minHeight: "100vh",
    marginTop: "8px",
    padding: "2rem 1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  uploadSection: {
    backgroundColor: "white",
    borderRadius: "20px",
    padding: "2rem",
    maxWidth: 500,
    minHeight: "400px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    textAlign: "center",
    border: "2px dashed #007bff",
    boxShadow: "0 4px 15px rgba(0, 123, 255, 0.1)",
    gap: "1rem",
  },
  uploadTitle: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    color: "#0056b3",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
  },
  uploadIcon: {
    fontSize: "2rem",
    color: "#17a2b8",
  },
  resultSection: {
    marginTop: "2rem",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    padding: "1.5rem 2.5rem",
    boxShadow: "0 4px 20px rgba(0, 123, 255, 0.3)",
    maxWidth: 600,
    minWidth: 450,
  },
  loader: {
    color: '#17a2b8 !important',
  },
  headerText: {
    fontSize: "2.5rem",
    fontWeight: "900",
    color: "#0056b3",
    marginBottom: "0.5rem",
    textAlign: "center",
  },
  subHeaderText: {
    fontSize: "1.2rem",
    color: "#007bff",
    marginBottom: "2rem",
    textAlign: "center",
  },
  uploadText: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#007bff",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
  }
}));

const CellAnalysis = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [error, setError] = useState(null);
  const [Image, setImage] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("cnn");
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [patients, setPatients] = useState([]);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [sendingReport, setSendingReport] = useState(false);

  let confidence = 0;

  const sendFile = useCallback(async () => {
    if (Image) {
      setError(null);
      try {
        let formData = new FormData();
        formData.append("file", selectedFile);
        let res = await axios({
          method: "post",
          url: `http://localhost:8000/predict?model=${selectedModel}`,
          data: formData,
        });

        if (res.status === 200) {
          setData(res.data);
        } else {
          setError(`API request failed with status code: ${res.status}`);
          console.error(`API request failed with status code: ${res.status}`);
        }
      } catch (error) {
        setError("Prediction failed. Please ensure the backend server is running and try again.");
        console.error("API request failed:", error);
      } finally {
        setIsloading(false);
      }
    }
  }, [Image, selectedFile, selectedModel, setData, setIsloading, setError]);

  const clearData = () => {
    setData(null);
    setError(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
  };

  const fetchPatients = async () => {
    try {
      const response = await apiService.getDoctorPatients();
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleSendReport = async () => {
    if (selectedPatients.length === 0) {
      alert('Please select at least one patient.');
      return;
    }

    setSendingReport(true);
    try {
      // Create reports for selected patients from the analysis
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('result', data.class);
      formData.append('confidence', confidence);
      selectedPatients.forEach(patientId => {
        formData.append('patients', patientId);
      });

      const response = await apiService.createReportFromAnalysis(formData);

      alert('Report sent successfully to selected patients.');
      setShowPatientModal(false);
      setSelectedPatients([]);
    } catch (error) {
      console.error('Error sending report:', error);
      alert('Failed to send report. Please try again.');
    } finally {
      setSendingReport(false);
    }
  };

  useEffect(() => {
    if (showPatientModal) {
      fetchPatients();
    }
  }, [showPatientModal]);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) {
      return;
    }
    setIsloading(true);
    sendFile();
  }, [preview, sendFile]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setImage(false);
      setData(undefined);
      setError(null);
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
    setError(null);
    setImage(true);
  };

  if (data) {
    confidence = (parseFloat(data.confidence) * 100).toFixed(2);
  }

  return (
    <div className="dashboard-container">
      <Topbar user={{ name: 'Dr. Smith', email: 'dr.smith@example.com' }} />
      <Sidebar />

      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Cell Analysis</h1>
          <p className="page-subtitle">Upload blood cell images for leukemia detection and analysis</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <Card className={Image ? classes.root : classes.uploadCard}>
            {Image && (
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  component="img"
                  src={preview}
                  title="Uploaded Blood Cell"
                />
              </CardActionArea>
            )}
            {!Image && (
              <CardContent className={classes.uploadSection}>
                <FormControl style={{minWidth: 120, marginBottom: '1rem'}}>
                  <InputLabel>Model</InputLabel>
                  <Select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                    <MenuItem value="cnn">CNN</MenuItem>
                    <MenuItem value="gru">CNN + GRU</MenuItem>
                  </Select>
                </FormControl>
                <div className={classes.uploadText}>
                  Upload Blood Cell Image for Leukemia Detection
                </div>
                <DropzoneArea
                  acceptedFiles={['image/*']}
                  dropzoneText="Drag & drop your blood cell image or click here to select."
                  onChange={onSelectFile}
                  showPreviews={false}
                  filesLimit={1}
                  maxFileSize={5000000}
                  dropzoneClass={classes.dropzone}
                  style={{ flex: 1, width: '100%', minHeight: '150px' }}
                />
              </CardContent>
            )}
            {data && (
              <CardContent className={classes.resultSection}>
                <div style={{ textAlign: "center", marginBottom: "1rem", color: data.class === 'myeloblast' ? "#dc3545" : "#28a745", fontWeight: "bold" }}>
                  {data.class === 'myeloblast' ? `Leukemia detected: ${data.class}` : 'No leukemia detected.'}
                </div>
                {selectedFile && (
                  <div style={{ textAlign: "center", marginBottom: "1rem", color: "#6c757d" }}>
                    Analyzed image: {selectedFile.name}
                  </div>
                )}
                <TableContainer component={Paper} elevation={0} style={{ width: "100%", overflowX: "auto" }}>
                  <Table size="medium" aria-label="result table">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ padding: "12px 24px", fontWeight: "bold" }}>Label</TableCell>
                        <TableCell align="right" style={{ padding: "12px 24px", fontWeight: "bold" }}>Confidence</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell style={{ padding: "12px 24px" }}>{data.class}</TableCell>
                        <TableCell align="right" style={{ padding: "12px 24px" }}>{confidence}%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <div style={{ marginTop: "1rem", textAlign: "center", color: "#6c757d" }}>
                  {data.class === 'basophil' && selectedModel === 'cnn' && "Basophil: A type of white blood cell involved in allergic responses. Normal presence indicates no leukemia. CNN identifies this based on characteristic dark granules and bilobed nucleus structure."}
                  {data.class === 'basophil' && selectedModel === 'gru' && "Basophil: A type of white blood cell involved in allergic responses. Normal presence indicates no leukemia. CNN+GRU detects sequential patterns in granule distribution and nuclear morphology."}
                  {data.class === 'erythroblast' && selectedModel === 'cnn' && "Erythroblast: Immature red blood cell. Normal in bone marrow, abnormal in peripheral blood may indicate issues, but not leukemia. CNN recognizes this by round shape, large nucleus, and basophilic cytoplasm."}
                  {data.class === 'erythroblast' && selectedModel === 'gru' && "Erythroblast: Immature red blood cell. Normal in bone marrow, abnormal in peripheral blood may indicate issues, but not leukemia. CNN+GRU analyzes sequential relationships in nuclear-cytoplasmic ratios and staining patterns."}
                  {data.class === 'monocyte' && selectedModel === 'cnn' && "Monocyte: A white blood cell that matures into macrophages. Normal immune function, no leukemia detected. CNN identifies this by kidney-shaped nucleus and abundant cytoplasm."}
                  {data.class === 'monocyte' && selectedModel === 'gru' && "Monocyte: A white blood cell that matures into macrophages. Normal immune function, no leukemia detected. CNN+GRU processes temporal patterns in nuclear indentation and cytoplasmic texture."}
                  {data.class === 'myeloblast' && selectedModel === 'cnn' && "Myeloblast: Immature myeloid cell. Presence in peripheral blood is a strong indicator of leukemia (acute myeloid leukemia or ALL). CNN detects this based on large round nucleus, fine chromatin, and scant cytoplasm - features typical of blast cells."}
                  {data.class === 'myeloblast' && selectedModel === 'gru' && "Myeloblast: Immature myeloid cell. Presence in peripheral blood is a strong indicator of leukemia (acute myeloid leukemia or ALL). CNN+GRU identifies sequential blast cell patterns, analyzing how nuclear features and cytoplasmic scarcity evolve in cellular development."}
                  {data.class === 'seg_neutrophil' && selectedModel === 'cnn' && "Segmented Neutrophil: Mature white blood cell for fighting infections. Normal immune response, no leukemia. CNN recognizes this by segmented nucleus (3-5 lobes) and neutrophilic granules."}
                  {data.class === 'seg_neutrophil' && selectedModel === 'gru' && "Segmented Neutrophil: Mature white blood cell for fighting infections. Normal immune response, no leukemia. CNN+GRU detects sequential maturation patterns in nuclear segmentation and granule organization."}
                </div>
                <div style={{ marginTop: "0.5rem", textAlign: "center", color: "#6c757d", fontStyle: "italic" }}>
                  {selectedModel === 'cnn' && "CNN analyzes spatial features and structure of the cell, focusing on immediate visual patterns in the image."}
                  {selectedModel === 'gru' && "CNN+GRU processes extracted features as sequences to detect temporal patterns and relationships in cell morphology."}
                </div>
                {data.image_info && (
                  <div style={{ marginTop: "0.5rem", textAlign: "center", color: "#6c757d" }}>
                    Image Details: {data.image_info.original_dimensions} | {data.image_info.file_size_kb} KB | Processed at {data.image_info.processed_resolution} | Model: {selectedModel === 'cnn' ? 'CNN' : 'CNN + GRU'}
                  </div>
                )}
                <div style={{ marginTop: "1rem", textAlign: "center" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => {
                      // Logic to send report to patients
                      // This will be implemented to show patient selection modal
                      setShowPatientModal(true);
                    }}
                    style={{ marginRight: "1rem" }}
                  >
                    Send to Patient
                  </Button>
                </div>
              </CardContent>
            )}
            {isLoading && (
              <CardContent className={classes.resultSection}>
                <CircularProgress color="secondary" className={classes.loader} />
                <div style={{ color: "#17a2b8", marginTop: "1rem", textAlign: "center" }}>
                  Matching... Please Wait...
                </div>
              </CardContent>
            )}
            {error && (
              <CardContent className={classes.resultSection} style={{ backgroundColor: "#ffebee", color: "#c62828" }}>
                <div style={{ textAlign: "center" }}>
                  Error: {error}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
        {data && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
            <ColorButton
              variant="contained"
              className={classes.clearButton}
              color="primary"
              size="large"
              onClick={clearData}
              startIcon={<Clear fontSize="large" />}
            >
              Clear
            </ColorButton>
          </div>
        )}

        {/* Patient Selection Modal */}
        <Dialog open={showPatientModal} onClose={() => setShowPatientModal(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Select Patients to Send Report</DialogTitle>
          <DialogContent>
            <List>
              {patients.map((patient) => (
                <ListItem key={patient.id} button onClick={() => {
                  const currentIndex = selectedPatients.indexOf(patient.id);
                  const newSelected = [...selectedPatients];

                  if (currentIndex === -1) {
                    newSelected.push(patient.id);
                  } else {
                    newSelected.splice(currentIndex, 1);
                  }

                  setSelectedPatients(newSelected);
                }}>
                  <ListItemText primary={`${patient.first_name} ${patient.last_name}`} secondary={patient.email} />
                  <ListItemSecondaryAction>
                    <Checkbox
                      edge="end"
                      onChange={() => {
                        const currentIndex = selectedPatients.indexOf(patient.id);
                        const newSelected = [...selectedPatients];

                        if (currentIndex === -1) {
                          newSelected.push(patient.id);
                        } else {
                          newSelected.splice(currentIndex, 1);
                        }

                        setSelectedPatients(newSelected);
                      }}
                      checked={selectedPatients.indexOf(patient.id) !== -1}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowPatientModal(false)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleSendReport}
              color="primary"
              variant="contained"
              disabled={sendingReport || selectedPatients.length === 0}
            >
              {sendingReport ? 'Sending...' : 'Send Report'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default CellAnalysis;
