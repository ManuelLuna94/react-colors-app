import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Button from "@material-ui/core/Button";
import { ChromePicker } from "react-color";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import DraggableColorBox from "./DraggableColorBox";

import "./NewPaletteForm.css";

const drawerWidth = 350;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    height: "64px",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    height: "calc(100vh - 64px)",
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function NewPaletteForm(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [color, setColor] = useState("#fffff");
  const handleChangeColor = (color) => {
    setColor(color.hex);
  };
  const [colors, setColors] = useState([]);
  const handleAddColor = () => {
    const newColor = {
      color,
      name: newName,
    };
    setColors([...colors, newColor]);
    setNewName("");
  };

  const [newName, setNewName] = useState("");
  const handleNameChange = (event) => setNewName(event.target.value);

  const [paletteName, setPaletteName] = useState("");
  const handlePaletteNameChange = (event) => setPaletteName(event.target.value);

  const toId = (stringName) => stringName.toLowerCase().replace(/ /g, "-");
  const savePalette = () => {
    const newPalette = {
      paletteName: paletteName,
      colors,
      id: toId(paletteName),
    };
    props.savePalette(newPalette);
    props.history.push("/");
  };

  const deleteColor = (colorName) => {
    const newColors = colors.filter((color) => color.name !== colorName);
    setColors(newColors);
  };

  useEffect(() => {
    ValidatorForm.addValidationRule("isUnique", (value) => {
      const isUnique = colors.find(
        (color) => color.name.toLowerCase() === value.toLowerCase()
      );
      if (!isUnique) return true;
      return false;
    });

    ValidatorForm.addValidationRule("isUniqueName", (value) => {
      if (props.itExists(toId(value))) return false;
      return true;
    });
  });

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="default"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Create palette
          </Typography>
          <ValidatorForm onSubmit={savePalette}>
            <TextValidator
              label="Palette name"
              value={paletteName}
              onChange={handlePaletteNameChange}
              validators={["required", "isUniqueName"]}
              errorMessages={[
                "Palettes need a name",
                "That palette already exists",
              ]}
            />
            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>
          </ValidatorForm>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <div className="NewPaletteForm-drawer-content">
          <Typography variant="h4">Design your palette</Typography>
          <Button variant="contained" color="secondary">
            Clear
          </Button>
          <Button variant="contained" color="primary">
            Random color
          </Button>
          <ChromePicker color={color} onChange={handleChangeColor} />
          <ValidatorForm onSubmit={handleAddColor}>
            <TextValidator
              value={newName}
              onChange={handleNameChange}
              validators={["required", "isUnique"]}
              errorMessages={["A name is required", "Name should be unique"]}
            />
            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: color }}
            >
              Add color
            </Button>
          </ValidatorForm>
        </div>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        {colors.map((color) => (
          <DraggableColorBox
            color={color}
            deleteColor={deleteColor}
            key={color.name}
          />
        ))}
      </main>
    </div>
  );
}
