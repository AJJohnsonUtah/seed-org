import { Cancel, Delete, Edit, Save } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { MyDateField } from "../common/components/MyDateField";
import { MyTextField } from "../common/components/MyTextField";
import { OrderService } from "../common/services/OrderService";
import { SeedInventoryService } from "../common/services/SeedInventoryService";

export function getCostNumber(val) {
  if (val?.$numberDecimal) {
    return Number.parseFloat(val.$numberDecimal);
  }
  return Number.parseFloat(val);
}

export function EditableOrderItem({ orderItem, onEditComplete, onDelete, isNewItem }) {
  const [allSeeds, setAllSeeds] = React.useState([]);

  React.useEffect(() => {
    SeedInventoryService.loadSeeds().then((s) => setAllSeeds(s));
  }, []);

  const [quantity, setQuantity] = React.useState(orderItem?.quantity || 1);
  const [unitCost, setUnitCost] = React.useState(orderItem?.unitCost?.$numberDecimal || orderItem?.unitCost || "");
  const [category, setCategory] = React.useState(orderItem?.category || "");
  const [description, setDescription] = React.useState(orderItem?.description || "");
  const [seedDetails, setSeedDetails] = React.useState(orderItem?.seedDetails || null);
  const [seedDetailsInputValue, setSeedDetailsInputValue] = React.useState(orderItem?.seedDetails?.name || "");
  const [isBeingEdited, setIsBeingEdited] = React.useState(!Boolean(orderItem));

  React.useEffect(() => {
    if (!category) {
      // Keep the category if adding multiple items
      setCategory(orderItem?.category || "");
    }
    setQuantity(orderItem?.quantity || 1);
    setUnitCost(orderItem?.unitCost?.$numberDecimal || orderItem?.unitCost || "");
    setDescription(orderItem?.description || "");
    setSeedDetails(orderItem?.seedDetails || null);
    setSeedDetailsInputValue(orderItem?.seedDetails?.name || "");
  }, [category, orderItem]);

  React.useEffect(() => {
    if (category !== "seed") {
      setSeedDetails(null);
    }
  }, [category]);

  function handleOrderItemSubmit(e) {
    e.preventDefault();
    setIsBeingEdited(false);
    // returning false will prevent the enter event from bubbling up.
    onEditComplete({
      quantity,
      unitCost,
      category,
      description,
      seedDetails,
    });
  }

  return (
    <>
      {isBeingEdited || isNewItem ? (
        <form onSubmit={handleOrderItemSubmit}>
          <Grid container spacing={1}>
            <Grid item xs={2}>
              <FormControl fullWidth>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  variant="standard"
                >
                  <MenuItem value="seed">Seed</MenuItem>
                  <MenuItem value="plant">Plant</MenuItem>
                  <MenuItem value="apparel">Apparel</MenuItem>
                  <MenuItem value="indoor-equipment">Indoor Equipment</MenuItem>
                  <MenuItem value="field-equipment">Field Equipment</MenuItem>
                  <MenuItem value="soil-amendment">Soil Amendment</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {category === "seed" ? (
              <Grid item xs={4}>
                <Autocomplete
                  autoFocus={true}
                  id="seed-details-for-planting"
                  options={allSeeds.sort((a, b) => {
                    const plantTypeCompare = -b.typeOfPlant.localeCompare(a.typeOfPlant);
                    if (plantTypeCompare === 0) {
                      return -b.name.localeCompare(a.name);
                    }
                    return -plantTypeCompare;
                  })}
                  autoHighlight
                  autoSelect
                  inputValue={seedDetailsInputValue}
                  onInputChange={(e, val) => setSeedDetailsInputValue(val)}
                  groupBy={(option) => option.typeOfPlant}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option._id === value?._id}
                  renderInput={(params) => <TextField {...params} label="Seed Details" variant="standard" />}
                  value={seedDetails}
                  onChange={(e, val) => {
                    setSeedDetails(val);
                    if (val) {
                      setDescription(val.name + " Seed");
                    }
                  }}
                />
              </Grid>
            ) : (
              <Grid item xs={4}>
                <MyTextField label="Description" value={description} setValue={setDescription} fullWidth required />
              </Grid>
            )}
            <Grid item xs={1}>
              <MyTextField
                label="Unit Cost"
                value={unitCost}
                setValue={setUnitCost}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={1}>
              <MyTextField label="Quantity" value={quantity} setValue={setQuantity} type="number" required />
            </Grid>
            <Grid item xs={1}>
              <IconButton type="submit" onClick={handleOrderItemSubmit} color="success">
                <Save />
              </IconButton>
            </Grid>
          </Grid>
        </form>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Typography variant="body2">{category}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2">{description}</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography variant="body2">${unitCost}</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography variant="body2">×{quantity}</Typography>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              onClick={() => {
                setIsBeingEdited(true);
              }}
              size="small"
            >
              <Edit />
            </IconButton>
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default function OrderDialog({ open, orderToEdit, onSave, onDelete, onCancel }) {
  const [vendor, setVendor] = React.useState(orderToEdit?.vendor || null);
  const [vendorInputText, setVendorInputText] = React.useState(orderToEdit?.vendor || "");
  const [subtotalCost, setSubtotalCost] = React.useState(orderToEdit?.subtotalCost?.$numberDecimal || null);
  const [shippingCost, setShippingCost] = React.useState(orderToEdit?.shippingCost?.$numberDecimal || null);
  const [totalCost, setTotalCost] = React.useState(orderToEdit?.totalCost?.$numberDecimal || null);
  const [orderDate, setOrderDate] = React.useState(orderToEdit?.orderDate || "");
  const [orderItems, setOrderItems] = React.useState(orderToEdit?.orderItems || []);
  const [orderAttachments, setOrderAttachments] = React.useState(orderToEdit?.orderAttachments || []);
  const [notes, setNotes] = React.useState(orderToEdit?.notes || "");
  const [itemToAdd, setItemToAdd] = React.useState({});
  const [hasSubmitted, setHasSubmitted] = React.useState(false);

  let itemCostPretax = 0;
  for (let i = 0; i < orderItems.length; i++) {
    itemCostPretax += getCostNumber(orderItems[i].unitCost) * getCostNumber(orderItems[i].quantity);
  }

  React.useEffect(() => {
    setVendor(orderToEdit?.vendor || null);
    setVendorInputText(orderToEdit?.vendor || "");
    setTotalCost(orderToEdit?.totalCost?.$numberDecimal || null);
    setSubtotalCost(orderToEdit?.subtotalCost?.$numberDecimal || null);
    setShippingCost(orderToEdit?.shippingCost?.$numberDecimal || null);
    setOrderDate(orderToEdit?.orderDate || "");
    setOrderItems(orderToEdit?.orderItems || []);
    setOrderAttachments(orderToEdit?.orderAttachments || null);
    setNotes(orderToEdit?.notes || null);
  }, [open, orderToEdit]);

  function deleteOrder() {
    if (window.confirm("Are you sure you want to delete this order? [_id: " + orderToEdit._id + "]?")) {
      OrderService.deleteOrderById(orderToEdit._id)
        .then(onDelete)
        .catch((e) => {
          console.error(e);
          alert("Error deleting order!");
        });
    }
  }

  function saveOrder() {
    setHasSubmitted(true);
    if (orderItems.length === 0 || !vendor || !totalCost || !orderDate) {
      return;
    }
    return OrderService.saveOrder({
      _id: orderToEdit?._id,
      vendor,
      subtotalCost,
      shippingCost,
      totalCost,
      orderItems,
      orderDate,
      notes,
    });
  }

  function onSubmit(e) {
    e.preventDefault();
    return saveOrder().then(onSave);
  }

  return (
    <Dialog open={open} fullWidth maxWidth="lg">
      <DialogTitle>{orderToEdit ? "Edit Order" : "Add New Order"}</DialogTitle>
      <DialogContent>
        <form onSubmit={onSubmit} style={{ width: "100%" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                autoFocus={true}
                id="order-vendor"
                options={[
                  "Greenhouse Megastore",
                  "Retain Your Rain / RainSoil",
                  "True Leaf Market",
                  "Baker Creek / Rare Seeds",
                  "Johnny's Select Seeds",
                  "Home Depot",
                  "Epic Gardening",
                  "Costco",
                ]}
                autoHighlight
                autoSelect
                inputValue={vendorInputText}
                onInputChange={(e, val) => setVendorInputText(val)}
                renderInput={(params) => <TextField {...params} label="Vendor" variant="standard" />}
                value={vendor}
                onChange={(e, val) => setVendor(val)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <MyDateField label="Order Date" value={orderDate} setValue={setOrderDate} required />
            </Grid>
            <Grid item xs={4} sm={2}>
              <MyTextField
                label="Subtotal"
                value={subtotalCost}
                setValue={setSubtotalCost}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={4} sm={2}>
              <MyTextField
                label="Shipping Cost"
                value={shippingCost}
                setValue={setShippingCost}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={4} sm={2}>
              <MyTextField
                label="Total Cost"
                value={totalCost}
                setValue={setTotalCost}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <MyTextField label="Notes" value={notes} setValue={setNotes} multiline rows={2} fullWidth />
            </Grid>
          </Grid>
          <input type="submit" style={{ display: "none" }} />
        </form>
        <Grid container spacing={2} style={{ marginTop: 8 }}>
          <Grid item>
            <Typography variant="h6">Order Items</Typography>
          </Grid>
          <Grid container item xs={12} spacing={1}>
            {orderItems.map((orderItem, i) => (
              <Grid item key={i} xs={12}>
                <EditableOrderItem
                  orderItem={orderItem}
                  isNewItem={false}
                  onEditComplete={(savedItem) => {
                    orderItems[i] = savedItem;
                    setOrderItems([...orderItems]);
                  }}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <EditableOrderItem
                orderItem={itemToAdd}
                isNewItem={true}
                onEditComplete={(savedItem) => {
                  orderItems.push(savedItem);
                  setOrderItems([...orderItems]);
                  setItemToAdd({});
                  saveOrder();
                }}
              />
              {hasSubmitted && orderItems.length === 0 && (
                <FormHelperText error>At least one order item must be added</FormHelperText>
              )}
              <Typography variant="body1">
                Pretax total: ${itemCostPretax.toFixed(2)}. Unaccounted for: $
                {(getCostNumber(subtotalCost) - itemCostPretax).toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {orderAttachments.length === 0 && <Typography variant="body1">No attachments found</Typography>}
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions style={{ justifyContent: "space-between" }}>
        <Button type="button" onClick={onCancel} startIcon={<Cancel />} color="warning">
          Cancel
        </Button>
        {orderToEdit?._id && (
          <Button type="button" onClick={deleteOrder} startIcon={<Delete />} color="error">
            Delete
          </Button>
        )}
        <Button type="button" onClick={onSubmit} startIcon={<Save />}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
