// put all collection on your database and try on noSqlBooster 


db.employeeDetails.aggregate([
  // stage 1
  // find all employeeDetails with comapnyId
  { $match: { companyId: ObjectId("657e8dca129074d6035004d4") } },

  {
    $lookup: {
      from: "user",
      localField: "userId",
      foreignField: "_id",
      as: "userDetails",
    },
  },
  {
    $unwind: {
      path: "$userDetails", // Unwind the '$offRollEmployment' array
    },
  },

  // stage -2
  {
    $facet: {
      offRollEmployee: [
        // 1 stage
        {
          $match: {
            offRollEmployeeId: { $ne: null },
          },
        },
        // stage -2

        {
          $lookup: {
            from: "OffRollEmployment",
            localField: "offRollEmployeeId",
            foreignField: "_id",
            as: "offRollEmployment",
          },
        },
        // stage 3
        {
          $unwind: {
            path: "$offRollEmployment", // Unwind the '$offRollEmployment' array
          },
        },
        {
          $match: {
            "offRollEmployment.employeeCode": "ON642",
          },
        },

        // {
        //     $match: {
        //         "userDetails.fullName": {$regex:"Mezbaul ", $options:"i"},
        //     },
        // },
      ],
      onRollEmployee: [
        {
          $match: {
            onRollEmployeeId: { $ne: null },
          },
        },
        {
          $lookup: {
            from: "onRollEmployment",
            localField: "onRollEmployeeId",
            foreignField: "_id",
            as: "onRollEmployment",
          },
        },
        // stage 3
        {
          $unwind: {
            path: "$onRollEmployment", // Unwind the '$offRollEmployment' array
          },
        },

        {
          $match: {
            "onRollEmployment.employeeCode": "ON642",
          },
        },
        //   {
        //         $match: {
        //             "userDetails.fullName":{$regex:"Mezbaul ", $options:"i"},
        //         },
        //     },

        // stage -4
      ],
    },
  },

  {
    $project: {
      result: {
        $concatArrays: ["$offRollEmployee", "$onRollEmployee"],
      },
    },
  },
]);
