"use client"

import { useState } from "react"
import {
  Plus,
  Minus,
  MapPin,
  Star,
  Building2,
  Users,
  Phone,
  Map,
  CheckCircle,
  AlertCircle,
  Home,
  DollarSign,
  Shield,
  Camera,
  FileText,
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Textarea } from "../components/ui/textarea"
import { Checkbox } from "../components/ui/checkbox"
import Badge from "@/components/ui/badge"
import {Separator} from "../components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import httpClient2 from "../lib/httpClient"
const PGIndexForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    contactNumber: "",
    email: "",
    websiteLink: "",
    foodType: "",
    minPrice: "",
    maxPrice: "",
    amenities: [],
    roomTypes: [],
    terms: [],
    images: [],
    googleMapsLink: "",
    googleRating: null,
    coordinates: [],
    isActive: true,
  })

  const [isDataFetched, setIsDataFetched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const pgTypes = [
    { value: "MALE", label: "Male Only" },
    { value: "FEMALE", label: "Female Only" },
    { value: "CO_LIVING", label: "Co-Living" },
    { value: "UNISEX", label: "Unisex" },
  ]

  const foodTypes = [
    { value: "VEG", label: "Vegetarian" },
    { value: "NON_VEG", label: "Non-Vegetarian" },
    { value: "BOTH", label: "Both" },
    { value: "NONE", label: "No Food Service" },
  ]

  const commonAmenities = [
    "WiFi",
    "AC",
    "Geyser",
    "Washing Machine",
    "Food",
    "Parking",
    "Security",
    "Power Backup",
    "Water Supply",
    "Housekeeping",
    "Laundry",
    "TV",
    "Fridge",
  ]

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const addAmenity = (amenity) => {
    if (!formData.amenities.includes(amenity)) {
      updateFormData("amenities", [...formData.amenities, amenity])
    }
  }

  const removeAmenity = (amenity) => {
    updateFormData(
      "amenities",
      formData.amenities.filter((a) => a !== amenity),
    )
  }

  const addRoomType = () => {
    const newRoom = {
      name: "",
      capacity: "",
      pricePerMonth: "",
      securityDeposit: "",
      description: "",
      amenities: [],
      isAcAvailable: false,
      attachedBathroom: false,
      isAvailable: true,
    }
    updateFormData("roomTypes", [...formData.roomTypes, newRoom])
  }

  const updateRoomType = (index, field, value) => {
    const updated = formData.roomTypes.map((room, i) => (i === index ? { ...room, [field]: value } : room))
    updateFormData("roomTypes", updated)
  }

  const removeRoomType = (index) => {
    updateFormData(
      "roomTypes",
      formData.roomTypes.filter((_, i) => i !== index),
    )
  }

  const addTerm = () => {
    updateFormData("terms", [...formData.terms, ""])
  }

  const updateTerm = (index, value) => {
    const updated = formData.terms.map((term, i) => (i === index ? value : term))
    updateFormData("terms", updated)
  }

  const removeTerm = (index) => {
    updateFormData(
      "terms",
      formData.terms.filter((_, i) => i !== index),
    )
  }

  const addImage = () => {
    updateFormData("images", [...formData.images, ""])
  }

  const updateImage = (index, value) => {
    const updated = formData.images.map((img, i) => (i === index ? value : img))
    updateFormData("images", updated)
  }

  const removeImage = (index) => {
    updateFormData(
      "images",
      formData.images.filter((_, i) => i !== index),
    )
  }

  const fetchGoogleData = async () => {
    setIsLoading(true)
    try {

      if(!(formData.address.trim() && formData.name.trim())){
        alert("Please enter address and name")
        return
      }
      const response=await httpClient2.post(`/geo-data`,{
        address:formData.address,
        name:formData.name
      });
      if(!response.data.success){
        alert(response.data.error)
        return
      }
      const {place_id,lat,lng,rating}=response.data.data;
      updateFormData("googleRating", rating)
      updateFormData("googleMapsLink", `https://www.google.com/maps/place/?q=place_id:${place_id}`)
      updateFormData("coordinates", [lat,lng])
      setIsDataFetched(true)
    } catch (error) {
      console.error("Error fetching Google data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "PG name is required"
    if (!formData.type) newErrors.type = "PG type is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.state.trim()) newErrors.state = "State is required"
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required"
    if (!formData.contactNumber.trim()) newErrors.contactNumber = "Contact number is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.foodType) newErrors.foodType = "Food type is required"
    if (!formData.minPrice) newErrors.minPrice = "Minimum price is required"
    if (!formData.maxPrice) newErrors.maxPrice = "Maximum price is required"
    if (formData.roomTypes.length === 0) newErrors.roomTypes = "At least one room type is required"
    if (!isDataFetched) newErrors.googleData = "Please fetch Google data first"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   if (!validateForm()) return

  //   setIsLoading(true)
  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 1500))

  //     console.log("PG Data to be indexed:", formData)
  //     alert("PG indexed successfully!")

  //     // Reset form
  //     setFormData({
  //       name: "",
  //       type: "",
  //       description: "",
  //       address: "",
  //       city: "",
  //       state: "",
  //       pincode: "",
  //       contactNumber: "",
  //       email: "",
  //       websiteLink: "",
  //       foodType: "",
  //       minPrice: "",
  //       maxPrice: "",
  //       amenities: [],
  //       roomTypes: [],
  //       terms: [],
  //       images: [],
  //       googleMapsLink: "",
  //       googleRating: null,
  //       coordinates: [],
  //       isActive: true,
  //     })
  //     setIsDataFetched(false)
  //   } catch (error) {
  //     console.error("Error indexing PG:", error)
  //     alert("Error indexing PG. Please try again.")
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setIsLoading(true);
    try {
      // Prepare the data with proper type conversion
      const submissionData = {
        ...formData,
        // Convert string numbers to floats
        minPrice: parseFloat(formData.minPrice),
        maxPrice: parseFloat(formData.maxPrice),
        // Convert room type numbers to floats
        roomTypes: formData.roomTypes.map(room => ({
          ...room,
          capacity: parseFloat(room.capacity),
          pricePerMonth: parseFloat(room.pricePerMonth),
          securityDeposit: parseFloat(room.securityDeposit || 0),
          // Ensure boolean fields are properly set
          isAcAvailable: Boolean(room.isAcAvailable),
          attachedBathroom: Boolean(room.attachedBathroom),
          isAvailable: room.isAvailable !== false, // default to true if not specified
          // Ensure amenities is always an array
          amenities: Array.isArray(room.amenities) ? room.amenities : []
        })),
        // Ensure arrays are always arrays
        amenities: Array.isArray(formData.amenities) ? formData.amenities : [],
        terms: Array.isArray(formData.terms) ? formData.terms : [],
        images: Array.isArray(formData.images) ? formData.images : [],
        // Ensure coordinates is an array of numbers
        coordinates: Array.isArray(formData.coordinates) 
          ? formData.coordinates.map(coord => parseFloat(coord))
          : [],
        // Convert googleRating to number if it exists
        googleRating: formData.googleRating ? parseFloat(formData.googleRating) : null
      };
  
      console.log("Submitting PG data:", submissionData);
      
      // Send data to your API endpoint
      const response=await httpClient2.post("/pg",submissionData);  
      if(!response.data.success){
        alert(response.data.error)
        return
      }
      
      alert("PG indexed successfully!");
  
      // Reset form
      setFormData({
        name: "",
        type: "",
        description: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        contactNumber: "",
        email: "",
        websiteLink: "",
        foodType: "",
        minPrice: "",
        maxPrice: "",
        amenities: [],
        roomTypes: [],
        terms: [],
        images: [],
        googleMapsLink: "",
        googleRating: null,
        coordinates: [],
        isActive: true,
      });
      setIsDataFetched(false);
    } catch (error) {
      console.error("Error indexing PG:", error);
      alert(`Error: ${error.message || "Failed to index PG. Please try again."}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-primary/10 rounded-full mr-4">
              <Building2 className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Index Your PG</h1>
              <p className="text-lg text-muted-foreground">
                Join our platform and connect with thousands of potential tenants
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-xl">
                <Home className="h-5 w-5 mr-2 text-primary" />
                Basic Information
              </CardTitle>
              <CardDescription>Tell us about your PG and what makes it special</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="name">PG Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    placeholder="Enter your PG name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="type">PG Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => updateFormData("type", value)}>
                    <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select PG type" />
                    </SelectTrigger>
                    <SelectContent>
                      {pgTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type}</p>}
                </div>

                <div>
                  <Label htmlFor="foodType">Food Type *</Label>
                  <Select value={formData.foodType} onValueChange={(value) => updateFormData("foodType", value)}>
                    <SelectTrigger className={errors.foodType ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select food type" />
                    </SelectTrigger>
                    <SelectContent>
                      {foodTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.foodType && <p className="text-sm text-red-500 mt-1">{errors.foodType}</p>}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                    placeholder="Describe your PG, its features, and what makes it special"
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Details */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-xl">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                Location Details
              </CardTitle>
              <CardDescription>Provide accurate location information for better visibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="address">Full Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    placeholder="Enter complete address including landmarks"
                    rows={3}
                    className={`resize-none ${errors.address ? "border-red-500" : ""}`}
                  />
                  {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateFormData("city", e.target.value)}
                    placeholder="City"
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
                </div>

                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => updateFormData("state", e.target.value)}
                    placeholder="State"
                    className={errors.state ? "border-red-500" : ""}
                  />
                  {errors.state && <p className="text-sm text-red-500 mt-1">{errors.state}</p>}
                </div>

                <div>
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => updateFormData("pincode", e.target.value)}
                    placeholder="Pincode"
                    className={errors.pincode ? "border-red-500" : ""}
                  />
                  {errors.pincode && <p className="text-sm text-red-500 mt-1">{errors.pincode}</p>}
                </div>
              </div>

              <Separator />

              {/* Google Data Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Google Integration</h3>
                    <p className="text-sm text-muted-foreground">Get rating and maps data automatically</p>
                  </div>
                  <Button
                    type="button"
                    onClick={fetchGoogleData}
                    disabled={isLoading ||(!formData.address.trim() || !formData.name.trim())}
                    variant="outline"
                    className="min-w-[140px]"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                        Fetching...
                      </>
                    ) : (
                      <>
                        <Star className="h-4 w-4 mr-2" />
                        Get Data
                      </>
                    )}
                  </Button>
                </div>

                {isDataFetched && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        Google Rating: {formData.googleRating}/5 ⭐
                      </AlertDescription>
                    </Alert>
                    <Alert className="border-blue-200 bg-blue-50">
                      <Map className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">Maps link generated successfully</AlertDescription>
                    </Alert>
                  </div>
                )}

                {errors.googleData && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.googleData}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-xl">
                <Phone className="h-5 w-5 mr-2 text-primary" />
                Contact Information
              </CardTitle>
              <CardDescription>How can potential tenants reach you?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="contactNumber">Contact Number *</Label>
                  <Input
                    id="contactNumber"
                    value={formData.contactNumber}
                    onChange={(e) => updateFormData("contactNumber", e.target.value)}
                    placeholder="Phone number"
                    className={errors.contactNumber ? "border-red-500" : ""}
                  />
                  {errors.contactNumber && <p className="text-sm text-red-500 mt-1">{errors.contactNumber}</p>}
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    placeholder="Email address"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="websiteLink">Website Link</Label>
                  <Input
                    id="websiteLink"
                    value={formData.websiteLink}
                    onChange={(e) => updateFormData("websiteLink", e.target.value)}
                    placeholder="https://your-website.com (optional)"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-xl">
                <DollarSign className="h-5 w-5 mr-2 text-primary" />
                Pricing Range
              </CardTitle>
              <CardDescription>Set your pricing range to attract the right tenants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="minPrice">Minimum Price (₹/month) *</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    value={formData.minPrice}
                    onChange={(e) => updateFormData("minPrice", e.target.value)}
                    placeholder="₹ per month"
                    className={errors.minPrice ? "border-red-500" : ""}
                  />
                  {errors.minPrice && <p className="text-sm text-red-500 mt-1">{errors.minPrice}</p>}
                </div>

                <div>
                  <Label htmlFor="maxPrice">Maximum Price (₹/month) *</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    value={formData.maxPrice}
                    onChange={(e) => updateFormData("maxPrice", e.target.value)}
                    placeholder="₹ per month"
                    className={errors.maxPrice ? "border-red-500" : ""}
                  />
                  {errors.maxPrice && <p className="text-sm text-red-500 mt-1">{errors.maxPrice}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-xl">
                <Shield className="h-5 w-5 mr-2 text-primary" />
                General Amenities
              </CardTitle>
              <CardDescription>Select all amenities available at your PG</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {commonAmenities.map((amenity) => (
                  <div
                    key={amenity}
                    onClick={() =>
                      formData.amenities.includes(amenity) ? removeAmenity(amenity) : addAmenity(amenity)
                    }
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 text-center ${
                      formData.amenities.includes(amenity)
                        ? "bg-primary text-primary-foreground border-primary shadow-md"
                        : "bg-background border-border hover:border-primary/50 hover:bg-primary/5"
                    }`}
                  >
                    <span className="text-sm font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
              {formData.amenities.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Selected amenities:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Room Types */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-xl">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Room Types
              </CardTitle>
              <CardDescription>Add different room configurations available at your PG</CardDescription>
              <Button type="button" onClick={addRoomType} className="w-fit">
                <Plus className="h-4 w-4 mr-2" />
                Add Room Type
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {errors.roomTypes && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.roomTypes}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-6">
                {formData.roomTypes.map((room, index) => (
                  <Card key={index} className="border-2 border-dashed border-muted">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Room Type {index + 1}</CardTitle>
                        <Button type="button" variant="destructive" size="sm" onClick={() => removeRoomType(index)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Room Name</Label>
                          <Input
                            value={room.name}
                            onChange={(e) => updateRoomType(index, "name", e.target.value)}
                            placeholder="e.g., Single, Double, Triple"
                          />
                        </div>
                        <div>
                          <Label>Capacity</Label>
                          <Input
                            type="number"
                            value={room.capacity}
                            onChange={(e) => updateRoomType(index, "capacity", Number.parseInt(e.target.value) || "")}
                            placeholder="Number of people"
                          />
                        </div>
                        <div>
                          <Label>Price per Month (₹)</Label>
                          <Input
                            type="number"
                            value={room.pricePerMonth}
                            onChange={(e) =>
                              updateRoomType(index, "pricePerMonth", Number.parseInt(e.target.value) || "")
                            }
                            placeholder="₹ per month"
                          />
                        </div>
                        <div>
                          <Label>Security Deposit (₹)</Label>
                          <Input
                            type="number"
                            value={room.securityDeposit}
                            onChange={(e) =>
                              updateRoomType(index, "securityDeposit", Number.parseInt(e.target.value) || "")
                            }
                            placeholder="₹ security deposit"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Room Description</Label>
                          <Textarea
                            value={room.description}
                            onChange={(e) => updateRoomType(index, "description", e.target.value)}
                            placeholder="Describe this room type"
                            rows={2}
                            className="resize-none"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-6 pt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`ac-${index}`}
                            checked={room.isAcAvailable}
                            onCheckedChange={(checked) => updateRoomType(index, "isAcAvailable", checked)}
                          />
                          <Label htmlFor={`ac-${index}`} className="text-sm font-normal">
                            AC Available
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`bathroom-${index}`}
                            checked={room.attachedBathroom}
                            onCheckedChange={(checked) => updateRoomType(index, "attachedBathroom", checked)}
                          />
                          <Label htmlFor={`bathroom-${index}`} className="text-sm font-normal">
                            Attached Bathroom
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`available-${index}`}
                            checked={room.isAvailable}
                            onCheckedChange={(checked) => updateRoomType(index, "isAvailable", checked)}
                          />
                          <Label htmlFor={`available-${index}`} className="text-sm font-normal">
                            Currently Available
                          </Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Terms & Conditions */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-xl">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Terms & Conditions
              </CardTitle>
              <CardDescription>Add any specific rules or conditions for your PG</CardDescription>
              <Button type="button" onClick={addTerm} variant="outline" className="w-fit">
                <Plus className="h-4 w-4 mr-2" />
                Add Term
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.terms.map((term, index) => (
                <div key={index} className="flex gap-3">
                  <Input
                    value={term}
                    onChange={(e) => updateTerm(index, e.target.value)}
                    placeholder="Enter a term or condition"
                    className="flex-1"
                  />
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeTerm(index)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-xl">
                <Camera className="h-5 w-5 mr-2 text-primary" />
                Images
              </CardTitle>
              <CardDescription>Add image URLs to showcase your PG</CardDescription>
              <Button type="button" onClick={addImage} variant="outline" className="w-fit">
                <Plus className="h-4 w-4 mr-2" />
                Add Image URL
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.images.map((image, index) => (
                <div key={index} className="flex gap-3">
                  <Input
                    value={image}
                    onChange={(e) => updateImage(index, e.target.value)}
                    placeholder="Enter image URL"
                    className="flex-1"
                  />
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeImage(index)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <Button
              type="submit"
              size="lg"
              disabled={isLoading || !isDataFetched}
              className="px-12 py-6 text-lg font-semibold min-w-[200px]"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Indexing Your PG...
                </>
              ) : (
                <>
                  <Building2 className="h-5 w-5 mr-3" />
                  Index Your PG
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PGIndexForm;