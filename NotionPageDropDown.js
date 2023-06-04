import { Client } from "@notionhq/client";
import { useQuery } from "react-query";
import DropDownPicker from "react-native-dropdown-picker";
import { useEffect, useState } from "react";

const notion = new Client({
  auth: "secret_yHaQUb38pleGSlh3Y0ND5GcYz3fYkssovqzVsZZ2xNz",
});

export const NotionPageDropdown = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const notion = useNotionPage();

  return (
    <DropDownPicker
      containerStyle={{
        width: "95%",
        height: "10%",
        marginTop: 10,
        marginLeft: "auto",
        marginRight: "auto",
      }}
      placeholder="Select a Notion Page"
      open={open}
      value={value}
      items={notion.pages}
      setOpen={setOpen}
      setValue={setValue}
    />
  );
};

const useNotionPage = () => {
  const query = useQuery(["notion", "page"], async () => {
    const response = await notion.search({
      query: "",
    });
    return response;
  });

  return {
    pages:
      query.data?.results
        .filter((page) => page.properties.title)
        .map((page) => ({
          label:
            console.log(page.properties.title) ||
            page.properties.title?.title[0].plain_text,
          value: page.id,
        })) || [],
  };
};
