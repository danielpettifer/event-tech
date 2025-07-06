import React, { useState, useEffect } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonList,
  IonAlert
} from '@ionic/react';
import { close, save, add, remove } from 'ionicons/icons';
import { Item } from '../types/Item';
import { ItemService } from '../services/ItemService';
import ImageUpload from './ImageUpload';

interface ItemFormProps {
  isOpen: boolean;
  onDidDismiss: () => void;
  item?: Item | null;
  onSave: () => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ isOpen, onDidDismiss, item, onSave }) => {
  const [formData, setFormData] = useState<Partial<Item>>({
    title: '',
    artist: '',
    medium: '',
    dimensions: '',
    year: new Date().getFullYear(),
    price: 0,
    currency: 'GBP',
    description: '',
    category: '',
    style: '',
    condition: 'Excellent',
    provenance: '',
    location: '',
    status: 'Available',
    isFramed: false,
    frameDescription: '',
    acquisitionDate: new Date().toISOString().split('T')[0],
    acquisitionPrice: 0,
    estimatedValue: 0,
    insuranceValue: 0,
    images: [],
    thumbnailImage: '',
    tags: [],
    exhibitions: [],
    publications: [],
    isPubliclyVisible: true,
    isFeatured: false,
    weight: 0,
    materials: [],
    techniques: [],
    edition: '',
    signature: '',
    certificate: false,
    notes: ''
  });

  const [newTag, setNewTag] = useState('');
  const [newMaterial, setNewMaterial] = useState('');
  const [newTechnique, setNewTechnique] = useState('');
  const [newExhibition, setNewExhibition] = useState('');
  const [newPublication, setNewPublication] = useState('');
  const [newImage, setNewImage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      // Reset form for new item
      setFormData({
        title: '',
        artist: '',
        medium: '',
        dimensions: '',
        year: new Date().getFullYear(),
        price: 0,
        currency: 'GBP',
        description: '',
        category: '',
        style: '',
        condition: 'Excellent',
        provenance: '',
        location: '',
        status: 'Available',
        isFramed: false,
        frameDescription: '',
        acquisitionDate: new Date().toISOString().split('T')[0],
        acquisitionPrice: 0,
        estimatedValue: 0,
        insuranceValue: 0,
        images: [],
        thumbnailImage: '',
        tags: [],
        exhibitions: [],
        publications: [],
        isPubliclyVisible: true,
        isFeatured: false,
        weight: 0,
        materials: [],
        techniques: [],
        edition: '',
        signature: '',
        certificate: false,
        notes: ''
      });
    }
  }, [item, isOpen]);

  const handleSave = () => {
    // Validation
    if (!formData.title || !formData.artist || !formData.medium) {
      setAlertMessage('Please fill in all required fields (Title, Artist, Medium).');
      setShowAlert(true);
      return;
    }

    const itemToSave: Item = {
      id: item?.id || ItemService.generateId(),
      title: formData.title!,
      artist: formData.artist!,
      medium: formData.medium!,
      dimensions: formData.dimensions || '',
      year: formData.year || new Date().getFullYear(),
      price: formData.price || 0,
      currency: formData.currency || 'GBP',
      description: formData.description || '',
      category: formData.category || '',
      style: formData.style || '',
      condition: formData.condition || 'Excellent',
      provenance: formData.provenance || '',
      location: formData.location || '',
      status: formData.status as any || 'Available',
      isFramed: formData.isFramed || false,
      frameDescription: formData.frameDescription || '',
      acquisitionDate: formData.acquisitionDate || new Date().toISOString().split('T')[0],
      acquisitionPrice: formData.acquisitionPrice || 0,
      estimatedValue: formData.estimatedValue || 0,
      insuranceValue: formData.insuranceValue || 0,
      images: formData.images || [],
      thumbnailImage: formData.thumbnailImage || (formData.images && formData.images[0]) || '',
      tags: formData.tags || [],
      exhibitions: formData.exhibitions || [],
      publications: formData.publications || [],
      isPubliclyVisible: formData.isPubliclyVisible !== false,
      isFeatured: formData.isFeatured || false,
      weight: formData.weight || 0,
      materials: formData.materials || [],
      techniques: formData.techniques || [],
      edition: formData.edition || '',
      signature: formData.signature || '',
      certificate: formData.certificate || false,
      notes: formData.notes || '',
      createdAt: item?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    ItemService.saveItem(itemToSave);
    onSave();
    onDidDismiss();
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  const addMaterial = () => {
    if (newMaterial.trim() && !formData.materials?.includes(newMaterial.trim())) {
      setFormData({
        ...formData,
        materials: [...(formData.materials || []), newMaterial.trim()]
      });
      setNewMaterial('');
    }
  };

  const removeMaterial = (materialToRemove: string) => {
    setFormData({
      ...formData,
      materials: formData.materials?.filter(material => material !== materialToRemove) || []
    });
  };

  const addTechnique = () => {
    if (newTechnique.trim() && !formData.techniques?.includes(newTechnique.trim())) {
      setFormData({
        ...formData,
        techniques: [...(formData.techniques || []), newTechnique.trim()]
      });
      setNewTechnique('');
    }
  };

  const removeTechnique = (techniqueToRemove: string) => {
    setFormData({
      ...formData,
      techniques: formData.techniques?.filter(technique => technique !== techniqueToRemove) || []
    });
  };

  const addExhibition = () => {
    if (newExhibition.trim() && !formData.exhibitions?.includes(newExhibition.trim())) {
      setFormData({
        ...formData,
        exhibitions: [...(formData.exhibitions || []), newExhibition.trim()]
      });
      setNewExhibition('');
    }
  };

  const removeExhibition = (exhibitionToRemove: string) => {
    setFormData({
      ...formData,
      exhibitions: formData.exhibitions?.filter(exhibition => exhibition !== exhibitionToRemove) || []
    });
  };

  const addPublication = () => {
    if (newPublication.trim() && !formData.publications?.includes(newPublication.trim())) {
      setFormData({
        ...formData,
        publications: [...(formData.publications || []), newPublication.trim()]
      });
      setNewPublication('');
    }
  };

  const removePublication = (publicationToRemove: string) => {
    setFormData({
      ...formData,
      publications: formData.publications?.filter(publication => publication !== publicationToRemove) || []
    });
  };

  const addImage = () => {
    if (newImage.trim() && !formData.images?.includes(newImage.trim())) {
      const updatedImages = [...(formData.images || []), newImage.trim()];
      setFormData({
        ...formData,
        images: updatedImages,
        thumbnailImage: formData.thumbnailImage || newImage.trim()
      });
      setNewImage('');
    }
  };

  const removeImage = (imageToRemove: string) => {
    const updatedImages = formData.images?.filter(image => image !== imageToRemove) || [];
    setFormData({
      ...formData,
      images: updatedImages,
      thumbnailImage: formData.thumbnailImage === imageToRemove ? (updatedImages[0] || '') : formData.thumbnailImage
    });
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{item ? 'Edit Item' : 'Add New Item'}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onDidDismiss}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        <div style={{ padding: '16px' }}>
          {/* Basic Information */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Basic Information</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonLabel position="stacked">Title *</IonLabel>
                <IonInput
                  value={formData.title}
                  onIonInput={(e) => setFormData({...formData, title: e.detail.value!})}
                  placeholder="Enter artwork title"
                />
              </IonItem>
              
              <IonItem>
                <IonLabel position="stacked">Artist *</IonLabel>
                <IonInput
                  value={formData.artist}
                  onIonInput={(e) => setFormData({...formData, artist: e.detail.value!})}
                  placeholder="Enter artist name"
                />
              </IonItem>
              
              <IonItem>
                <IonLabel position="stacked">Medium *</IonLabel>
                <IonInput
                  value={formData.medium}
                  onIonInput={(e) => setFormData({...formData, medium: e.detail.value!})}
                  placeholder="e.g., Oil on Canvas"
                />
              </IonItem>
              
              <IonGrid>
                <IonRow>
                  <IonCol size="6">
                    <IonItem>
                      <IonLabel position="stacked">Dimensions</IonLabel>
                      <IonInput
                        value={formData.dimensions}
                        onIonInput={(e) => setFormData({...formData, dimensions: e.detail.value!})}
                        placeholder="e.g., 120 x 90 cm"
                      />
                    </IonItem>
                  </IonCol>
                  <IonCol size="6">
                    <IonItem>
                      <IonLabel position="stacked">Year</IonLabel>
                      <IonInput
                        type="number"
                        value={formData.year}
                        onIonInput={(e) => setFormData({...formData, year: parseInt(e.detail.value!) || new Date().getFullYear()})}
                        placeholder="2024"
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>
              </IonGrid>
              
              <IonItem>
                <IonLabel position="stacked">Description</IonLabel>
                <IonTextarea
                  value={formData.description}
                  onIonInput={(e) => setFormData({...formData, description: e.detail.value!})}
                  placeholder="Enter artwork description..."
                  rows={3}
                />
              </IonItem>
            </IonCardContent>
          </IonCard>

          {/* Classification */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Classification</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol size="6">
                    <IonItem>
                      <IonLabel position="stacked">Category</IonLabel>
                      <IonSelect
                        value={formData.category}
                        onIonChange={(e) => setFormData({...formData, category: e.detail.value})}
                        placeholder="Select category"
                      >
                        <IonSelectOption value="Abstract Art">Abstract Art</IonSelectOption>
                        <IonSelectOption value="Landscape">Landscape</IonSelectOption>
                        <IonSelectOption value="Portrait">Portrait</IonSelectOption>
                        <IonSelectOption value="Still Life">Still Life</IonSelectOption>
                        <IonSelectOption value="Seascape">Seascape</IonSelectOption>
                        <IonSelectOption value="Geometric Art">Geometric Art</IonSelectOption>
                        <IonSelectOption value="Sculpture">Sculpture</IonSelectOption>
                        <IonSelectOption value="Photography">Photography</IonSelectOption>
                        <IonSelectOption value="Mixed Media">Mixed Media</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonCol>
                  <IonCol size="6">
                    <IonItem>
                      <IonLabel position="stacked">Style</IonLabel>
                      <IonSelect
                        value={formData.style}
                        onIonChange={(e) => setFormData({...formData, style: e.detail.value})}
                        placeholder="Select style"
                      >
                        <IonSelectOption value="Contemporary">Contemporary</IonSelectOption>
                        <IonSelectOption value="Traditional">Traditional</IonSelectOption>
                        <IonSelectOption value="Modern">Modern</IonSelectOption>
                        <IonSelectOption value="Classical">Classical</IonSelectOption>
                        <IonSelectOption value="Impressionist">Impressionist</IonSelectOption>
                        <IonSelectOption value="Expressionist">Expressionist</IonSelectOption>
                        <IonSelectOption value="Realism">Realism</IonSelectOption>
                        <IonSelectOption value="Surrealism">Surrealism</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>

          {/* Pricing and Status */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Pricing and Status</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol size="8">
                    <IonItem>
                      <IonLabel position="stacked">Price</IonLabel>
                      <IonInput
                        type="number"
                        value={formData.price}
                        onIonInput={(e) => setFormData({...formData, price: parseFloat(e.detail.value!) || 0})}
                        placeholder="0"
                      />
                    </IonItem>
                  </IonCol>
                  <IonCol size="4">
                    <IonItem>
                      <IonLabel position="stacked">Currency</IonLabel>
                      <IonSelect
                        value={formData.currency}
                        onIonChange={(e) => setFormData({...formData, currency: e.detail.value})}
                      >
                        <IonSelectOption value="GBP">GBP</IonSelectOption>
                        <IonSelectOption value="USD">USD</IonSelectOption>
                        <IonSelectOption value="EUR">EUR</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonCol>
                </IonRow>
              </IonGrid>
              
              <IonItem>
                <IonLabel position="stacked">Status</IonLabel>
                <IonSelect
                  value={formData.status}
                  onIonChange={(e) => setFormData({...formData, status: e.detail.value})}
                >
                  <IonSelectOption value="Available">Available</IonSelectOption>
                  <IonSelectOption value="Sold">Sold</IonSelectOption>
                  <IonSelectOption value="Reserved">Reserved</IonSelectOption>
                  <IonSelectOption value="On Loan">On Loan</IonSelectOption>
                  <IonSelectOption value="In Restoration">In Restoration</IonSelectOption>
                  <IonSelectOption value="Not for Sale">Not for Sale</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonGrid>
                <IonRow>
                  <IonCol size="6">
                    <IonItem>
                      <IonLabel position="stacked">Estimated Value</IonLabel>
                      <IonInput
                        type="number"
                        value={formData.estimatedValue}
                        onIonInput={(e) => setFormData({...formData, estimatedValue: parseFloat(e.detail.value!) || 0})}
                        placeholder="0"
                      />
                    </IonItem>
                  </IonCol>
                  <IonCol size="6">
                    <IonItem>
                      <IonLabel position="stacked">Insurance Value</IonLabel>
                      <IonInput
                        type="number"
                        value={formData.insuranceValue}
                        onIonInput={(e) => setFormData({...formData, insuranceValue: parseFloat(e.detail.value!) || 0})}
                        placeholder="0"
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>

          {/* Images */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Images</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <ImageUpload
                value={formData.thumbnailImage}
                onImageChange={(thumbnail) => {
                  setFormData({
                    ...formData,
                    thumbnailImage: thumbnail
                  });
                }}
                images={formData.images || []}
                onImagesChange={(images) => {
                  setFormData({
                    ...formData,
                    images,
                    thumbnailImage: formData.thumbnailImage || images[0] || ''
                  });
                }}
                allowMultiple={true}
                maxImages={10}
                label="Artwork Images"
                placeholder="Upload artwork images or enter URLs"
              />
              
              <div style={{ marginTop: '16px' }}>
                <IonItem>
                  <IonInput
                    value={newImage}
                    onIonInput={(e) => setNewImage(e.detail.value!)}
                    placeholder="Or enter image URL directly"
                    onKeyPress={(e) => e.key === 'Enter' && addImage()}
                  />
                  <IonButton fill="clear" onClick={addImage}>
                    <IonIcon icon={add} />
                  </IonButton>
                </IonItem>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Tags */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Tags</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonInput
                  value={newTag}
                  onIonInput={(e) => setNewTag(e.detail.value!)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <IonButton fill="clear" onClick={addTag}>
                  <IonIcon icon={add} />
                </IonButton>
              </IonItem>
              <div style={{ marginTop: '8px' }}>
                {formData.tags?.map((tag, index) => (
                  <IonChip key={index} color="primary">
                    <IonLabel>{tag}</IonLabel>
                    <IonIcon icon={remove} onClick={() => removeTag(tag)} />
                  </IonChip>
                ))}
              </div>
            </IonCardContent>
          </IonCard>

          {/* Settings */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Settings</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonCheckbox
                  checked={formData.isPubliclyVisible}
                  onIonChange={(e) => setFormData({...formData, isPubliclyVisible: e.detail.checked})}
                />
                <IonLabel style={{ marginLeft: '8px' }}>Publicly Visible</IonLabel>
              </IonItem>
              
              <IonItem>
                <IonCheckbox
                  checked={formData.isFeatured}
                  onIonChange={(e) => setFormData({...formData, isFeatured: e.detail.checked})}
                />
                <IonLabel style={{ marginLeft: '8px' }}>Featured Item</IonLabel>
              </IonItem>
              
              <IonItem>
                <IonCheckbox
                  checked={formData.isFramed}
                  onIonChange={(e) => setFormData({...formData, isFramed: e.detail.checked})}
                />
                <IonLabel style={{ marginLeft: '8px' }}>Framed</IonLabel>
              </IonItem>
              
              <IonItem>
                <IonCheckbox
                  checked={formData.certificate}
                  onIonChange={(e) => setFormData({...formData, certificate: e.detail.checked})}
                />
                <IonLabel style={{ marginLeft: '8px' }}>Certificate of Authenticity</IonLabel>
              </IonItem>
            </IonCardContent>
          </IonCard>

          {/* Additional Information */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Additional Information</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonLabel position="stacked">Location</IonLabel>
                <IonInput
                  value={formData.location}
                  onIonInput={(e) => setFormData({...formData, location: e.detail.value!})}
                  placeholder="e.g., Main Gallery - Wall A"
                />
              </IonItem>
              
              <IonItem>
                <IonLabel position="stacked">Condition</IonLabel>
                <IonSelect
                  value={formData.condition}
                  onIonChange={(e) => setFormData({...formData, condition: e.detail.value})}
                >
                  <IonSelectOption value="Mint">Mint</IonSelectOption>
                  <IonSelectOption value="Excellent">Excellent</IonSelectOption>
                  <IonSelectOption value="Very Good">Very Good</IonSelectOption>
                  <IonSelectOption value="Good">Good</IonSelectOption>
                  <IonSelectOption value="Fair">Fair</IonSelectOption>
                  <IonSelectOption value="Poor">Poor</IonSelectOption>
                </IonSelect>
              </IonItem>
              
              <IonItem>
                <IonLabel position="stacked">Signature</IonLabel>
                <IonInput
                  value={formData.signature}
                  onIonInput={(e) => setFormData({...formData, signature: e.detail.value!})}
                  placeholder="e.g., Signed bottom right"
                />
              </IonItem>
              
              <IonItem>
                <IonLabel position="stacked">Notes</IonLabel>
                <IonTextarea
                  value={formData.notes}
                  onIonInput={(e) => setFormData({...formData, notes: e.detail.value!})}
                  placeholder="Additional notes..."
                  rows={3}
                />
              </IonItem>
            </IonCardContent>
          </IonCard>

          {/* Save Button */}
          <IonButton expand="block" onClick={handleSave} style={{ margin: '16px 0' }}>
            <IonIcon icon={save} slot="start" />
            {item ? 'Update Item' : 'Save Item'}
          </IonButton>
        </div>
      </IonContent>

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Validation Error"
        message={alertMessage}
        buttons={['OK']}
      />
    </IonModal>
  );
};

export default ItemForm;
