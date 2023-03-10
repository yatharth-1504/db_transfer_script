const { Client } = require("pg");

const client_new = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "yatharth",
  database: "instispaceV2",
});

const client_old = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "yatharth",
  database: "instispace_backup",
});

client_new.connect();
client_old.connect();

// User Table
const populateUserTable = () =>
  client_old.query(`SELECT * FROM "User" `, async (err, res) => {
    if (!err) {
      console.log(`fetched entries ${res.rows.length}`);
      let count = 0;
      const retrived_entries = await Promise.all(
        res.rows.map((i) => {
          const text =
            'INSERT INTO "User"("id","name","ldapName","roll","password","mobile","isNewUser","role","mpath","permissionId","createdById","hostelId") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *';
          const values = [
            i.id,
            i.name,
            i.ldapName,
            i.roll,
            i.password,
            i.mobile,
            i.isNewUser,
            i.role == "HAS" ? "SECRETARY" : i.role,
            i.id + ".",
            null,
            null,
            i.hostelId,
          ];

          client_new.query(text, values, (err, res) => {
            if (err) {
              console.log(err.stack);
            } else {
              count++;
            }
          });
        })
      );
      count = retrived_entries.length;
      console.log(`retrived entries ${count}`);
    } else {
      console.log(err.stack);
    }
  });

// Hostels
const populateHostelTable = () => {
  client_old.query(`select * from "Hostel" `, (err, res) => {
    if (!err) {
      console.log(`fetched entries ${res.rows.length}`);
      let count = 0;
      for (const i of res.rows) {
        const text =
          'INSERT INTO "Hostel"("id","name") VALUES($1, $2) RETURNING *';
        const values = [i.id, i.name];
        client_new.query(text, values, (err, res) => {
          if (err) {
            console.log(err.stack);
          } else {
            count = count + 1;
          }
        });
      }
      console.log(`retrived entries ${count}`);
    } else {
      console.log(err.message);
    }
  });
};

// Permission Table
const populatePermissionTable = () => {
  const text =
    'INSERT INTO "Permission"("id","account","livePosts","hostel","createTag","createNotification","handleReports","approvePosts") VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';

  const values_user = [
    "b593d939-6f7f-44ae-b8ed-bed165c99fdb",
    null,
    [
      "Opportunity",
      "Connect",
      "Query",
      "Help",
      "Review",
      "Random thought",
      "LOST",
      "FOUND",
    ],
    null,
    false,
    false,
    false,
    false,
  ];

  client_new.query(text, values_user, (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      console.log(`Values inserted`);
    }
  });

  const values_admin = [
    "c312bbb8-847c-4fac-a835-15a40fc4be03",
    ["LEADS", "SECRETARY", "MODERATOR", "HOSTEL_SEC"],
    [
      "Event",
      "Announcement",
      "Recruitment",
      "Competition",
      "Opportunity",
      "Connect",
      "Query",
      "Help",
      "Review",
      "Random thought",
    ],
    ["Hostel", "Contact", "Ameninity"],
    true,
    true,
    true,
    true,
  ];

  client_new.query(text, values_admin, (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      console.log(`Values inserted`);
    }
  });

  const values_secys = [
    "23cde38a-bbcc-4fae-8fdc-767533c8e4eb",
    ["LEADS", "MODERATOR", "HOSTEL_SEC"],
    [
      "Event",
      "Announcement",
      "Recruitment",
      "Competition",
      "Opportunity",
      "Connect",
      "Query",
      "Help",
      "Review",
      "Random thought",
    ],
    ["Hostel", "Contact", "Ameninity"],
    true,
    true,
    true,
    true,
  ];

  client_new.query(text, values_secys, (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      console.log("Values inserted");
    }
  });

  // for CFI
  values_leads = [
    "e94c6959-d113-4ad6-bb6c-41a2b7cd239f",
    ["LEADS"],
    [
      "Event",
      "Announcement",
      "Recruitment",
      "Competition",
      "Opportunity",
      "Connect",
      "Query",
      "Help",
      "Review",
      "Random thought",
    ],
    null,
    false,
    false,
    false,
    true,
  ];

  client_new.query(text, values_leads, (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      console.log("Values inserted");
    }
  });

  // for LEADS other than CFI
  values__leads = [
    "4000fd64-3cbd-46e4-b8f3-b24e08bd6c6c",
    null,
    [
      "Event",
      "Announcement",
      "Recruitment",
      "Competition",
      "Opportunity",
      "Connect",
      "Query",
      "Help",
      "Review",
      "Random thought",
    ],
    null,
    false,
    false,
    false,
    false,
  ];

  client_new.query(text, values__leads, (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      console.log("Values inserted");
    }
  });

  const values_mods = [
    "56745e84-86a9-4dcd-9de4-915849840635",
    null,
    [
      "Opportunity",
      "Connect",
      "Query",
      "Help",
      "Review",
      "Random thought",
      "LOST",
      "FOUND",
    ],
    null,
    false,
    false,
    true,
    false,
  ];

  client_new.query(text, values_mods, (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      console.log("Values inserted");
    }
  });

  // HOSTEL_SECYS
  values_hsecys = [
    "afb4d34f-cf44-4632-a167-2cdbf3a0f7c0",
    ["HOSTEL_SEC"],
    [
      "Announcement",
      "Opportunity",
      "Connect",
      "Query",
      "Help",
      "Review",
      "Random thought",
    ],
    ["Contact", "Ameninity"],
    false,
    false,
    false,
    false,
  ];

  client_new.query(text, values_hsecys, (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      console.log("Values inserted");
    }
  });
};

const updatePermissions = () => {
  const texts = [
    `update "User" set "permissionId"='c312bbb8-847c-4fac-a835-15a40fc4be03' where role='ADMIN';`,
    `update "User" set "permissionId"='23cde38a-bbcc-4fae-8fdc-767533c8e4eb' where role='SECRETARY' AND roll<>'cfi@smail.iitm.ac.in'`,
    `update "User" set "permissionId"='b593d939-6f7f-44ae-b8ed-bed165c99fdb' where role='USER';`,
    `update "User" set "permissionId"='e94c6959-d113-4ad6-bb6c-41a2b7cd239f' where roll='cfi@smail.iitm.ac.in';`,
    `update "User" set "permissionId"='4000fd64-3cbd-46e4-b8f3-b24e08bd6c6c' where role='LEADS';`,
    `update "User" set "permissionId"='56745e84-86a9-4dcd-9de4-915849840635' where role='MODERATOR';`,
    `update "User" set "permissionId"='afb4d34f-cf44-4632-a167-2cdbf3a0f7c0' where role='HOSTEL_SEC';`,
  ];

  texts.map((text) => {
    client_new.query(text, (err, res) => {
      if (err) {
        console.error(err.stack);
      } else {
        console.log("Permissions Updated");
      }
    });
  });
};

const populateTagTable = () => {
  client_old.query(`select * from "Tag" `, (err, res) => {
    if (!err) {
      console.log(`fetched entries ${res.rows.length}`);
      let count = 0;
      for (const i of res.rows) {
        const text =
          'INSERT INTO "Tag"("id","title","category") VALUES($1, $2, $3) RETURNING *';
        const values = [i.id, i.title, i.category];

        client_new.query(text, values, (err, res) => {
          if (err) {
            console.log(err.stack);
          } else {
            count++;
          }
        });
      }
      console.log(`retrived entries ${count}`);
    } else {
      console.log(err.message);
    }
  });
};

populateTagUserTable = () => {
  client_old.query(`select * from "tag_users_user" `, (err, res) => {
    if (!err) {
      console.log(`fetched entries ${res.rows.length}`);
      let count = 0;
      for (const i of res.rows) {
        const text =
          'INSERT INTO "tag_users_user"("tagId","userId") VALUES($1, $2) RETURNING *';
        const values = [i.tagId, i.userId];

        client_new.query(text, values, (err, res) => {
          if (err) {
            console.log(err.stack);
          } else {
            count++;
          }
        });
      }
      console.log(`retrived entries ${count}`);
    } else {
      console.log(err.message);
    }
  });
};

const populatePost_Events = () => {
  client_old.query(`select * from "Event" `, (err, res) => {
    if (!err) {
      console.log(`fetched entries ${res.rows.length}`);
      let count = 0;
      for (const i of res.rows) {
        const text =
          'INSERT INTO "Post"("id","createdAt","updatedAt","title","content","category","photo","isHidden","location","status","linkName","Link","endTime","postTime","createdById") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *';
        const values = [
          i.id,
          i.createdAt,
          i.createdAt,
          i.title,
          i.content,
          "Event",
          i.photo,
          i.isHidden,
          i.location,
          "POSTED",
          i.linkName,
          i.linkToAction,
          new Date(new Date(i.time).setHours(new Date(i.time).getHours() + 2)),
          i.time,
          i.createdById,
        ];
        client_new.query(text, values, (err, res) => {
          if (err) {
            console.log(err.stack);
          } else {
            count = count + 1;
          }
        });
      }
      console.log(`retrived entries ${count}`);
    } else {
      console.log(err.message);
    }
  });
};

const populatePost_Item = () => {
  // Item
  client_old.query(`select * from "Item" `, (err, res) => {
    if (!err) {
      console.log(`fetched entries ${res.rows.length}`);
      let count = 0;
      for (const i of res.rows) {
        const text =
          'INSERT INTO "Post"("id","createdAt","updatedAt","title","content","category","photo","isHidden","location","status","linkName","Link","endTime","postTime","createdById") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *';
        const values = [
          i.id,
          i.createdAt,
          i.createdAt,
          i.contact,
          i.name,
          i.category,
          i.images,
          i.isResolved,
          i.location,
          "POSTED",
          null,
          null,
          null,
          null,
          i.userId,
        ];
        client_new.query(text, values, (err, res) => {
          if (err) {
            console.log(err.stack);
          } else {
            count++;
          }
        });
      }
      console.log(`retrived entries ${count}`);
    } else {
      console.log(err.message);
    }
  });
};

const populatePost_Query = () => {
  // Query
  client_old.query(`select * from "MyQuery" `, (err, res) => {
    if (!err) {
      console.log(`fetched entries ${res.rows.length}`);
      let count = 0;
      for (const i of res.rows) {
        const text =
          'INSERT INTO "Post"("id","createdAt","updatedAt","title","content","category","photo","isHidden","location","status","linkName","Link","endTime","postTime","createdById") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *';
        const values = [
          i.id,
          i.createdAt,
          i.createdAt,
          i.title,
          i.content,
          "Query",
          i.photo,
          i.isHidden,
          null,
          i.status,
          null,
          null,
          null,
          null,
          i.createdById,
        ];
        client_new.query(text, values, (err, res) => {
          if (err) {
            console.log(err.stack);
          } else {
            count++;
          }
        });
      }
      console.log(`retrived entries ${count}`);
    } else {
      console.log(err.message);
    }
  });
};

const populatePosts_Netop = () => {
  // Opportunity
  client_old.query(`select * from "Netop" `, (err, res) => {
    if (!err) {
      console.log(`fetched entries ${res.rows.length}`);
      let count = 0;
      for (const i of res.rows) {
        const text =
          'INSERT INTO "Post"("id","createdAt","updatedAt","title","content","category","photo","isHidden","location","status","linkName","Link","endTime","postTime","createdById") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *';
        const values = [
          i.id,
          i.createdAt,
          i.createdAt,
          i.title,
          i.content,
          "opportunities",
          i.photo,
          i.isHidden,
          null,
          i.status,
          i.linkName,
          i.linkToAction,
          i.endTime,
          null,
          i.createdById,
        ];
        client_new.query(text, values, (err, res) => {
          if (err) {
            console.log(err.stack);
          } else {
            count++;
          }
        });
      }
      console.log(`retrived entries ${count}`);
    } else {
      console.log(err.message);
    }
  });
};

const populatePost_Rel = () => {
  client_old.query(`select * from "event_liked_by_user" `, (err, res) => {
    if (!err) {
      console.log(`fetched entries ${res.rows.length}`);
      let count = 0;
      for (const i of res.rows) {
        const text =
          'INSERT INTO "post_liked_by_user"("postId","userId") VALUES($1, $2) RETURNING *';
        const values = [i.eventId, i.userId];

        client_new.query(text, values, (err, res) => {
          if (err) {
            console.log(err.stack);
          } else {
            count++;
          }
        });
      }
      console.log(`retrived entries ${count}`);
    } else {
      console.log(err.message);
    }
  });

  client_old.query(`select * from "event_stared_by_user" `, (err, res) => {
    if (!err) {
      console.log(`fetched entries ${res.rows.length}`);
      let count = 0;
      for (const i of res.rows) {
        const text =
          'INSERT INTO "post_saved_by_user"("postId","userId") VALUES($1, $2) RETURNING *';
        const values = [i.eventId, i.userId];

        client_new.query(text, values, (err, res) => {
          if (err) {
            console.log(err.stack);
          } else {
            count++;
          }
        });
      }
      console.log(`retrived entries ${count}`);
    } else {
      console.log(err.message);
    }
  });

  client_old.query(`select * from "event_tags_tag" `, (err, res) => {
    if (!err) {
      console.log(`fetched entries ${res.rows.length}`);
      let count = 0;
      for (const i of res.rows) {
        const text =
          'INSERT INTO "post_tags_tag"("postId","tagId") VALUES($1, $2) RETURNING *';
        const values = [i.eventId, i.tagId];

        client_new.query(text, values, (err, res) => {
          if (err) {
            console.log(err.stack);
          } else {
            count++;
          }
        });
      }
      console.log(`retrived entries ${count}`);
    } else {
      console.log(err.message);
    }
  });

  client_old.query(`select * from "my_query_liked_by_user" `, (err, res) => {
    if (!err) {
      console.log(`fetched entries ${res.rows.length}`);
      let count = 0;
      for (const i of res.rows) {
        const text =
          'INSERT INTO "post_liked_by_user"("postId","userId") VALUES($1, $2) RETURNING *';
        const values = [i.myQueryId, i.userId];

        client_new.query(text, values, (err, res) => {
          if (err) {
            console.log(err.stack);
          } else {
            count++;
          }
        });
      }
      console.log(`retrived entries ${count}`);
    } else {
      console.log(err.message);
    }
  });

  client_old.query(`select * from "netop_liked_by_user" `, (err, res) => {
    if (!err) {
      console.log(`fetched entries ${res.rows.length}`);
      let count = 0;
      for (const i of res.rows) {
        const text =
          'INSERT INTO "post_liked_by_user"("postId","userId") VALUES($1, $2) RETURNING *';
        const values = [i.netopId, i.userId];

        client_new.query(text, values, (err, res) => {
          if (err) {
            console.log(err.stack);
          } else {
            count++;
          }
        });
      }
      console.log(`retrived entries ${count}`);
    } else {
      console.log(err.message);
    }
  });

  client_old.query(`select * from "netop_stared_by_user" `, (err, res) => {
    if (!err) {
      console.log(`fetched entries ${res.rows.length}`);
      let count = 0;
      for (const i of res.rows) {
        const text =
          'INSERT INTO "post_saved_by_user"("postId","userId") VALUES($1, $2) RETURNING *';
        const values = [i.netopId, i.userId];

        client_new.query(text, values, (err, res) => {
          if (err) {
            console.log(err.stack);
          } else {
            count++;
          }
        });
      }
      console.log(`retrived entries ${count}`);
    } else {
      console.log(err.message);
    }
  });

  client_old.query(`select * from "netop_tags_tag" `, (err, res) => {
    if (!err) {
      console.log(`fetched entries ${res.rows.length}`);
      let count = 0;
      for (const i of res.rows) {
        const text =
          'INSERT INTO "post_tags_tag"("postId","tagId") VALUES($1, $2) RETURNING *';
        const values = [i.netopId, i.tagId];

        client_new.query(text, values, (err, res) => {
          if (err) {
            console.log(err.stack);
          } else {
            count++;
          }
        });
      }
      console.log(`retrived entries ${count}`);
    } else {
      console.log(err.message);
    }
  });
};

const populateReportReasons = () => {
  client_old.query(`select * from "Reason" `, (err, res) => {
    if (!err) {
      console.log(`fetched entries ${res.rows.length}`);
      let count = 0;
      for (const i of res.rows) {
        const text =
          'INSERT INTO "Reasons"("id","reason","count") VALUES($1, $2, $3) RETURNING *';
        const values = [i.id, i.reason, i.count];
        client_new.query(text, values, (err, res) => {
          if (err) {
            console.log(err.stack);
          } else {
            count = count + 1;
          }
        });
      }
      console.log(`retrived entries ${count}`);
    } else {
      console.log(err.message);
    }
  });
};

const populateReportTable = () => {
  client_old.query(`select * from "Report" `, (err, res) => {
    if (!err) {
      console.log(`fetched entries ${res.rows.length}`);
      let count = 0;
      for (const i of res.rows) {
        const text =
          'INSERT INTO "Report"("id","description","createdAt","postId","commentId","createdById") VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
        const values = [
          i.id,
          i.description,
          i.createdAt,
          i.netopId ? i.netopId : i.queryId,
          null,
          i.createdById,
        ];
        client_new.query(text, values, (err, res) => {
          if (err) {
            console.log(err.stack);
          } else {
            count = count + 1;
          }
        });
      }
      console.log(`retrived entries ${count}`);
    } else {
      console.log(err.message);
    }
  });
};

const update_mpath_secys = () => {
  client_new.query(`select * from "User" where role='ADMIN'`, (err, _res) => {
    if (err) console.log(err.stack);
    else
      client_new.query(
        `select * from "User" where role='SECRETARY' AND roll<>'sec_arts@smail.iitm.ac.in'`,
        (err, res) => {
          if (err) console.log(err.stack);
          else
            for (const i of res.rows) {
              mpath = _res.rows[0].mpath + i.mpath;
              client_new.query(
                `update "User" set "mpath"='${mpath}' where roll='${i.roll}'`,
                (err, res) => {
                  if (err) console.log(err.stack);
                  else console.log("mpath updated");
                }
              );
            }
        }
      );
  });
};

const update_createdBy_secys = () => {
  client_new.query(
    `update "User" set "createdById"='0c428bf6-a1d4-45a7-9288-6c08ea7b570b' where role='SECRETARY' AND roll<>'sec_arts@smail.iitm.ac.in'`,
    (err, res) => {
      if (!err) {
        console.log("Parent updated");
      } else {
        console.log(err.stack);
      }
    }
  );
};

const update_parent_cfi = () => {
  client_new.query(
    `select * from "User" where roll='sec_cocur@smail.iitm.ac.in'`,
    (err, _res) => {
      if (err) console.log(err.stack);
      else
        client_new.query(
          `select * from "User" where roll='cfi@smail.iitm.ac.in'`,
          (err, res) => {
            if (err) console.log(err.stack);
            else {
              mpath = _res.rows[0].mpath + res.rows[0].mpath;
              client_new.query(
                `update "User" set "mpath"='${mpath}',"createdById"='${_res.rows[0].id}' where roll='cfi@smail.iitm.ac.in'`,
                (err, res) => {
                  if (err) console.log(err.stack);
                  else console.log("Parent Updated");
                }
              );
            }
          }
        );
    }
  );
};

const update_parent_leads = () => {
  client_new.query(
    `select * from "User" where roll='cfi@smail.iitm.ac.in'`,
    (err, _res) => {
      if (err) console.log(err.stack);
      else {
        const rolls = [
          "igem@smail.iitm.ac.in",
          "envisage@shaastra.org",
          "thepdc.cfi@gmail.com",
          "horizon.iitm@gmail.com",
          "cvigroup.cfi@gmail.com",
          "elecclub.cfi@gmail.com",
          "programmingclubiitm@gmail.com",
          "3dpc.cfi.iitm@gmail.com",
          "analyticsclub.cfi@gmail.com",
          "analyticsclubcfi.iitm@gmail.com",
          "ibotcfi@gmail.com",
          "cfiwebops@smail.iitm.ac.in",
          "aeroclub.cfi@gmail.com",
          "teamsahaayiitm@gmail.com",
          "raftar@smail.iitm.ac.in",
          "abhiyaan@smail.iitm.ac.in",
          "agnirath@smail.iitm.ac.in",
          "teamanveshak@smail.iitm.ac.in",
          "avishkarhyperloop@smail.iitm.ac.in",
          "abhyudayiitm@smail.iitm.ac.in",
        ];
        rolls.map((r) => {
          client_new.query(
            `select * from "User" where roll='${r}'`,
            (err, res) => {
              if (err) console.error(err.stack);
              else {
                mpath = _res.rows[0].mpath + res.rows[0].mpath;
                client_new.query(
                  `update "User" set "createdById"='${_res.rows[0].id}',"mpath"='${mpath}' where roll='${r}'`,
                  (err, res) => {
                    if (err) console.log(err.stack);
                    else console.log("Parent Updated");
                  }
                );
              }
            }
          );
        });
      }
    }
  );
};

const update_parent_arts = () => {
  client_new.query(
    `select * from "User" where roll='sec_lit@smail.iitm.ac.in'`,
    (err, _res) => {
      if (err) console.log(err.stack);
      else
        client_new.query(
          `select * from "User" where roll='sec_arts@smail.iitm.ac.in'`,
          (err, res) => {
            if (err) console.log(err.stack);
            else {
              mpath = _res.rows[0].mpath + res.rows[0].mpath;
              client_new.query(
                `update "User" set "mpath"='${mpath}',"createdById"='${_res.rows[0].id}' where roll='sec_arts@smail.iitm.ac.in'`,
                (err, res) => {
                  if (err) console.log(err.stack);
                  else console.log("Parent Updated");
                }
              );
            }
          }
        );
    }
  );
};

const update_parent_leads_cul = () => {
  client_new.query(
    `select * from "User" where roll='sec_arts@smail.iitm.ac.in'`,
    (err, _res) => {
      if (err) console.log(err.stack);
      else {
        const rolls = [
          "thespian@saarang.org",
          "spotlight@saarang.org",
          "finearts@saarang.org",
          "meraki@saarang.org",
          "oratoryclub@saarang.org",
          "classicalarts@saarang.org",
          "culinary@saarang.org",
          "designandvfxclub@saarang.org",
          "musicclub@saarang.org",
          "wordgames@saarang.org",
          "nova@saarang.org",
          "raj@saarang.org",
          "gaming@saarang.org",
          "informals@saarang.org",
          "rheaabu@saarang.org",
          "writingclub.iitm@gmail.com",
          "sangam@smail.iitm.ac.in",
          "quizclubiitm@gmail.com",
        ];
        rolls.map((r) => {
          client_new.query(
            `select * from "User" where roll='${r}'`,
            (err, res) => {
              if (err) console.error(err.stack);
              else {
                mpath = _res.rows[0].mpath + res.rows[0].mpath;
                client_new.query(
                  `update "User" set "createdById"='${_res.rows[0].id}',"mpath"='${mpath}' where roll='${r}'`,
                  (err, res) => {
                    if (err) console.log(err.stack);
                    else console.log("Parent Updated");
                  }
                );
              }
            }
          );
        });
      }
    }
  );
};

const update_mpath_leads_gen = () => {
  client_new.query(
    `select * from "User" where roll='gen_sec@smail.iitm.ac.in'`,
    (err, _res) => {
      if (err) console.log(err.stack);
      else {
        const rolls = [
          "mobops@smail.iitm.ac.in",
          "saathi_core@smail.iitm.ac.in",
        ];
        rolls.map((r) => {
          client_new.query(
            `select * from "User" where roll='${r}'`,
            (err, res) => {
              if (err) console.error(err.stack);
              else {
                mpath = _res.rows[0].mpath + res.rows[0].mpath;
                client_new.query(
                  `update "User" set "createdById"='${_res.rows[0].id}',"mpath"='${mpath}' where roll='${r}'`,
                  (err, res) => {
                    if (err) console.log(err.stack);
                    else console.log("Parent Updated");
                  }
                );
              }
            }
          );
        });
      }
    }
  );
};

const update_mpath_leads_cocur = () => {
  client_new.query(
    `select * from "User" where roll='sec_cocur@smail.iitm.ac.in'`,
    (err, _res) => {
      if (err) console.log(err.stack);
      else {
        const rolls = [
          "ed19b003@smail.iitm.ac.in",
          "techsoc@smail.iitm.ac.in",
          "nirmaan@smail.iitm.ac.in",
          "head_ecell@smail.iitm.ac.in",
        ];
        rolls.map((r) => {
          client_new.query(
            `select * from "User" where roll='${r}'`,
            (err, res) => {
              if (err) console.error(err.stack);
              else {
                mpath = _res.rows[0].mpath + res.rows[0].mpath;
                client_new.query(
                  `update "User" set "createdById"='${_res.rows[0].id}',"mpath"='${mpath}' where roll='${r}'`,
                  (err, res) => {
                    if (err) console.log(err.stack);
                    else console.log("Parent Updated");
                  }
                );
              }
            }
          );
        });
      }
    }
  );
};

const update_mpath_leads_acads = () => {
  client_new.query(
    `select * from "User" where roll='sec_acaf@smail.iitm.ac.in'`,
    (err, _res) => {
      if (err) console.log(err.stack);
      else {
        const rolls = [
          "placementhead.ug@smail.iitm.ac.in",
          "cdc@smail.iitm.ac.in",
          "internshiphead@smail.iitm.ac.in",
          "caseclub@smail.iitm.ac.in",
          "financeclub@smail.iitm.ac.in",
        ];
        rolls.map((r) => {
          client_new.query(
            `select * from "User" where roll='${r}'`,
            (err, res) => {
              if (err) console.error(err.stack);
              else {
                mpath = _res.rows[0].mpath + res.rows[0].mpath;
                client_new.query(
                  `update "User" set "createdById"='${_res.rows[0].id}',"mpath"='${mpath}' where roll='${r}'`,
                  (err, res) => {
                    if (err) console.log(err.stack);
                    else console.log("Parent Updated");
                  }
                );
              }
            }
          );
        });
      }
    }
  );
};

const update_mpath_leads_sports = () => {
  client_new.query(
    `select * from "User" where roll='sec_sprts@smail.iitm.ac.in'`,
    (err, _res) => {
      if (err) console.log(err.stack);
      else {
        const rolls = ["soc@smail.iitm.ac.in", "nitya@smail.iitm.ac.in"];
        rolls.map((r) => {
          client_new.query(
            `select * from "User" where roll='${r}'`,
            (err, res) => {
              if (err) console.error(err.stack);
              else {
                mpath = _res.rows[0].mpath + res.rows[0].mpath;
                client_new.query(
                  `update "User" set "createdById"='${_res.rows[0].id}',"mpath"='${mpath}' where roll='${r}'`,
                  (err, res) => {
                    if (err) console.log(err.stack);
                    else console.log("Parent Updated");
                  }
                );
              }
            }
          );
        });
      }
    }
  );
};

// populateHostelTable();
// populateUserTable();
// populatePermissionTable();
// updatePermissions();
// populateTagTable();
// populateTagUserTable();
// populatePost_Events();
// populatePost_Item();
// populatePost_Query();
// populatePosts_Netop();
// populatePost_Rel();
// populateReportReasons();
// populateReportTable();
// update_mpath_secys();
// update_createdBy_secys();
// update_parent_cfi();
// update_parent_leads();
// update_parent_arts();
// update_parent_leads_cul();
// update_mpath_leads_gen();
// update_mpath_leads_cocur()
// update_mpath_leads_acads();
// update_mpath_leads_sports();

client_new.end;
client_old.end;
