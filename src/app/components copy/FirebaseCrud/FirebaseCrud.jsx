"use client";
import FirebaseConfig from "../FirebaseConfig/FirebaseConfig";
import React, { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export function InputForm() {
  const form =
    useForm <
    z.infer <
    typeof FormSchema >>
      {
        resolver: zodResolver(FormSchema),
        defaultValues: {
          username: "",
        },
      };

  function onSubmit(data) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form>
      <form onSubmit={onSubmit} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

import {
  ref,
  set,
  update,
  remove,
  child,
  get,
  getDatabase,
} from "firebase/database";
import { useState } from "react";
import "./FirebaseCrud.css";

const database = FirebaseConfig();

export default function FirebaseCrud() {
  useEffect(() => {
    const intervalId = setInterval(() => {
      // RefreshMotionDetector();
      // Call the RefreshData function here
      // For example, if you have a reference to the FirebaseCrud component, you can call RefreshData on it
      // Example: firebaseCrudRef.current.RefreshData();
    }, 10000); /* make it 1000 later for sure */

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures that the effect runs only once when the component mounts

  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [sensorDetect, setsensorDetect] = useState("");
  let [unlockDoor, setUnlockDoor] = useState("");

  let isNullOrWhiteSpaces = (value) => {
    value = value.toString();
    return (value == null || value.replaceAll(" ", " ")).length < 1;
  };

  let UpdateData = () => {
    const dbref = ref(database);

    if (isNullOrWhiteSpaces(username)) {
      alert(
        "username is empty, try to select a user first, with the select button"
      );
      return;
    }
    get(child(dbref, "Customer/" + username))
      .then((snapshot) => {
        if (snapshot.exists()) {
          update(ref(database, "/Customer/" + username), {
            unlockDoorFunc: unlockDoor,
          })
            .then(() => {
              alert("operation performed successfully");
            })
            .catch((error) => {
              console.log(error);
              alert("there was an error updating the customer");
            });
        } else {
          alert("error : the user doesn't exist");
        }
      })
      .catch((error) => {
        console.log(error);
        alert("error data retrieval was unsuccessful");
      });
  };

  let DeleteData = () => {
    const dbref = ref(database);

    if (isNullOrWhiteSpaces(username)) {
      alert("username is required ro delete a user");
      return;
    }

    get(child(dbref, "Customer/" + username)).then((snapshot) => {
      if (snapshot.exists()) {
        remove(ref(database, "Customer/" + username))
          .then(() => {
            alert("customer deleted successfully");
          })
          .catch((error) => {
            console.log(error);
            alert("there was an error deleting the customer");
          });
      } else {
        alert("error : the user does exist");
      }
    });
  };

  let InsertData = () => {
    const dbref = ref(database);

    if (
      isNullOrWhiteSpaces(username) ||
      isNullOrWhiteSpaces(password) ||
      isNullOrWhiteSpaces(sensorDetect) ||
      isNullOrWhiteSpaces(unlockDoor)
    ) {
      alert("fill all the fields");
      return;
    }

    set(ref(database, "/Customer/" + username), {
      password: password,
      sensorDetect: sensorDetect,
      unlockDoorFunc: unlockDoor,
    });
  };

  let SelectData = () => {
    const dbref = ref(database);

    get(child(dbref, "Customer/" + username))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setPassword(snapshot.val().password);
          setsensorDetect(snapshot.val().sensorDetect);
          setUnlockDoor(snapshot.val().unlockDoorFunc);
        } else {
          alert("no data available");
        }
      })
      .catch((error) => {
        console.log(error);
        alert("select: error data retrieval was unsuccessful");
      });
  };
  let RefreshData = () => {
    const dbref = ref(database);

    if (isNullOrWhiteSpaces(username)) {
      alert("Username is required to get data");
      return;
    }

    get(child(dbref, "/Customer/" + username))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setPassword(snapshot.val().password);
          setsensorDetect(snapshot.val().sensorDetect);
          setUnlockDoor(snapshot.val().unlockDoorFunc);
          let tmppass = snapshot.val().password;
          let tmpsensorDetect = snapshot.val().sensorDetect;
          let x;
          if (tmpsensorDetect >= 1) {
            x = "YES";
          } else x = "NO";
          let tmpunlockdoor = snapshot.val().unlockDoorFunc;

          alert(
            "Current Status is:\n password: " +
              tmppass +
              "\n" +
              "is sensor detecting something" +
              x
          );
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
        alert("select: error data retrieval was unsuccessful");
      });
  };
  let RefreshMotionDetector = () => {
    const dbref = ref(database);

    get(child(dbref, "/Customer/sid"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setPassword(snapshot.val().password);
          setsensorDetect(snapshot.val().sensorDetect);
          setUnlockDoor(snapshot.val().unlockDoorFunc);
          let tmppass = snapshot.val().password;
          let tmpsensorDetect = snapshot.val().sensorDetect;
          let x;
          if (tmpsensorDetect >= 1) {
            x = "YES";
          } else x = "NO";
          let tmpunlockdoor = snapshot.val().unlockDoorFunc;

          alert(
            "Current Status is:\n password: " +
              tmppass +
              "\n" +
              "is sensor detecting something" +
              x
          );
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
        alert("select: error data retrieval was unsuccessful");
      });
  };

  return (
    <>
      <div className="flex justify-center content-center">
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <br />

        <label>Password</label>
        <input
          type="text"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <br />

        <label>sensorDetect</label>
        <input
          type="text"
          value={sensorDetect}
          onChange={(e) => {
            setsensorDetect(e.target.value);
          }}
        />
        <br />

        <label>Unlock Door (0/1)</label>
        <input
          type="text"
          value={unlockDoor}
          onChange={(e) => {
            setUnlockDoor(e.target.value);
          }}
        />
        <br />

        <button onClick={InsertData}>Insert data</button>
        <button onClick={UpdateData}>Update data</button>
        {/* <button onClick={DeleteData}>Delete data</button> */}
        <button onClick={SelectData}>Select data</button>
        <button onClick={RefreshData}>Refresh data</button>
      </div>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
