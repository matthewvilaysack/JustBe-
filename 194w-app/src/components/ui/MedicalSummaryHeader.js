import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import theme from "@/src/theme/theme";

const MedicalSummaryHeader = ({ handleGeneratePDF, handleSharePDF }) => {
  return (
    <View style={styles.header}>
      <Link href={"/tabs/export"}>
        <MaterialCommunityIcons size={24} name="arrow-left" color={"white"} />
      </Link>
      <View style={styles.headerIcons}>
        <TouchableOpacity onPress={handleGeneratePDF}>
          <MaterialCommunityIcons size={24} name="reload" color={"white"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSharePDF}>
          <MaterialCommunityIcons
            size={24}
            name="export-variant"
            color={"white"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: theme.colors.darkBlue,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 20,
  },
});

export default MedicalSummaryHeader;
